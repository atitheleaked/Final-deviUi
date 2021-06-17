import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Sonuc } from 'src/app/models/Sonuc';
import { Uye } from 'src/app/models/Uye';
import { ApiService } from 'src/app/services/api.service';
import { MyAlertService } from 'src/app/services/myAlert.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    public apiServis: ApiService,
    public matDialog: MatDialog,
    public alert: MyAlertService,
    public route: ActivatedRoute
  ) { }

  // tslint:disable-next-line:semicolon
  // tslint:disable-next-line:align
  ngOnInit() {
    
  }
  OturumAc(kadi: string, parola: string) {
    // tslint:disable-next-line:prefer-const
    var yeniKayit: Uye = new Uye();
    yeniKayit.KullaniciAdi = kadi;
    yeniKayit.Sifre = parola;
    yeniKayit.UyeAdmin = 0;

    this.apiServis.UyeEkle(yeniKayit).subscribe((d: any) => {
      location.href = '/login';

    }, err => {
      var s: Sonuc = new Sonuc();
      s.islem = false;
      s.mesaj = 'Kullanıcı Adı veya Parola Geçersizdir!';
      this.alert.AlertUygula(s);
    });
  }

}


