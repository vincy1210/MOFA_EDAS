import { Component, OnInit } from '@angular/core';
import { data } from 'jquery';
import { ApiService } from 'src/service/api.service';
import { CommonService } from 'src/service/common.service';
import { ConstantsService } from 'src/service/constants.service';
import { XmlService } from 'src/service/xml.service';
import { PdfConverterService } from '../pdf-converter.service';

@Component({
  selector: 'app-e-seal-test',
  templateUrl: './e-seal-test.component.html',
  styleUrls: ['./e-seal-test.component.css'],
})
export class ESealTestComponent implements OnInit {
  listOfFiles: File[] = [];
  isLoading = false;

  constructor(
    private commonService: CommonService,
    public apiservice: ApiService,
    public consts: ConstantsService,
    public xmlService: XmlService,
    private pdfConverterService: PdfConverterService
  ) {}

  ngOnInit(): void {}

  onFileChanged(event: any) {
    this.isLoading = true;
    this.listOfFiles = [];
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (selectedFile) {
        if (selectedFile.size <= 2 * 1024 * 1024) {
          this.listOfFiles.push(selectedFile);
        } else {
          this.commonService.showErrorMessage(
            'File size exceeds the allowed limit (2 MB).'
          );
        }
      }
    }
    this.isLoading = false;
  }

  clickESealBE() {
    this.convertToBase64(this.listOfFiles[0])
      .then((base64String) => {
        if (base64String) {
          this.onSubmitForESeal(base64String); //xmlDoc1
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  clickESealFE() {
    this.convertToBase64(this.listOfFiles[0])
      .then((base64String) => {
        this.xmlService
          .loadXmlFile('./assets/xml/e-seal.xml')
          .subscribe((xmlDoc) => {
            const serializer = new XMLSerializer();
            let xmlString: string = xmlDoc; //serializer.serializeToString(xmlDoc);
            xmlString = xmlString.replace('{client_id}', 'icp_eSeal_stage');
            xmlString = xmlString.replace(
              '{client_secret}',
              'Sc837EzlZryDN06V'
            );
            xmlString = xmlString.replace('{pdfBase64File}', base64String);
            if (xmlString) {
              this.submitInvoiceAttestations(xmlString); //xmlDoc1
            }
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = (e.target as any).result.split(',')[1];
        resolve(base64String);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }

  onSubmitForESeal(file64: string) {
    const data = {
      base64file: file64
    };

    this.apiservice.postForESeal('http://localhost:5010/api/Test/CheckESeal', data).subscribe({
      next: (data: any) => {
        let response: any = data;
        console.log('response:', response);
        this.convertAndSavePdf(response);
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  convertAndSavePdf(base64Data: string) {
    const blob = this.pdfConverterService.convertBase64ToBlob(base64Data);
    const fileName = 'ESealedFile.pdf';
    this.pdfConverterService.savePdf(blob, fileName);
  }

  submitInvoiceAttestations(data: any) {
    this.apiservice
      .postXML(this.consts.eSealSoapGatewayUrl, data)
      .subscribe((response: any) => {
        console.log('response: ', response);
      });
  }
}
