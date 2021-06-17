import { Sonuc } from './../../models/Sonuc';
import { Yorum } from './../../models/Yorum';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Makale } from 'src/app/models/Makale';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MyAlertService } from 'src/app/services/myAlert.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MakaleDialogComponent } from '../dialogs/makale-dialog/makale-dialog.component';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-makale',
  templateUrl: './makale.component.html',
  styleUrls: ['./makale.component.scss']
})
export class MakaleComponent implements OnInit {
  makaleId: number;
  makale: Makale;
  yorumlar: Yorum[];
  uyeId: any;
  secyor: Yorum;
  uyeYetkileri: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dialogRef: MatDialogRef<MakaleDialogComponent>;
  dialogRefConfirm: MatDialogRef<ConfirmDialogComponent>;
  
  constructor(
    public apiServis: ApiService,
    public matDialog: MatDialog,
    public alert: MyAlertService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      if (p.makaleId) {
        this.makaleId = p.makaleId;
        this.MakaleById();
        this.MakaleYorumListe();
        // tslint:disable-next-line:radix
        this.uyeId = parseInt(localStorage.getItem('uid'));
        
      }

    });
  }

  MakaleSahibimi(id){
    if (id === this.uyeId && this.makale.DogruCevapId == null ){
      return true;
    }
  }
  YorumSahibimi(id){
    if (id === this.uyeId ){
      
      return true;
    }
  }

  //  Bu doğru cevap seçme fonksiyonur
  DogruCevap(kayit: Makale, id: any) {
    this.dialogRefConfirm = this.matDialog.open(ConfirmDialogComponent, {
      width: '800px',
      data: {
        kayit: kayit,
        islem: 'duzenle'
      }
    });
    this.dialogRef.afterClosed().subscribe(d => {
      if (d) {
        kayit.DogruCevapId = id;
        this.apiServis.MakaleDuzenle(kayit).subscribe((s: Sonuc) => {
          this.alert.AlertUygula(s);
          if (s.islem) {
          }
        });
      }
    });
  }

  MakaleDuzenle(kayit: Makale) {
    this.dialogRef = this.matDialog.open(MakaleDialogComponent, {
      width: '800px',
      data: {
        kayit: kayit,
        islem: 'duzenle'
      }
    });
    this.dialogRef.afterClosed().subscribe(d => {
      if (d) {
        kayit.Baslik = d.Baslik;
        kayit.Icerik = d.Icerik;
        this.apiServis.MakaleDuzenle(kayit).subscribe((s: Sonuc) => {
          this.alert.AlertUygula(s);
          if (s.islem) {
          }
        });
      }
    });
  }

  YorumSil(kayit: Yorum) {
    this.dialogRefConfirm = this.matDialog.open(ConfirmDialogComponent, {
      width: '400px',
    });
    this.dialogRefConfirm.componentInstance.dialogMesaj =  " Yorum Silinecektir Onaylıyor musunuz?";

    this.dialogRefConfirm.afterClosed().subscribe(d => {
      if (d) {
        this.apiServis.YorumSil(kayit.YorumId).subscribe((s: Sonuc) => {
          this.alert.AlertUygula(s);
          if (s.islem) {
          }
        });
      }
    });
  }
  MakaleSil(kayit: Makale) {
    this.dialogRefConfirm = this.matDialog.open(ConfirmDialogComponent, {
      width: '400px',
    });
    this.dialogRefConfirm.componentInstance.dialogMesaj =  " Makale Silinecektir Onaylıyor musunuz?";

    this.dialogRefConfirm.afterClosed().subscribe(d => {
      if (d) {
        this.apiServis.MakaleSil(kayit.MakaleId).subscribe((s: Sonuc) => {
          this.alert.AlertUygula(s);
          if (s.islem) {
          }
        });
      }
    });
  }


  MakaleById() {
    this.apiServis.MakaleById(this.makaleId).subscribe((d: Makale) => {
      this.makale = d;
      this.MakaleOkunduYap();
    });
  }
  MakaleOkunduYap() {
    this.makale.Okunma += 1;
    this.apiServis.MakaleDuzenle(this.makale).subscribe();
  }

  MakaleYorumListe() {
    this.apiServis.YorumListeBymakaleId(this.makaleId).subscribe((d: Yorum[]) => {
      this.yorumlar = d;
      console.log(this.yorumlar);
    });
  }

  YorumEkle(yorumMetni: string) {
    var yorum: Yorum = new Yorum();
    // tslint:disable-next-line:radix
    var uyeId: number = parseInt(localStorage.getItem('uid'));
    yorum.MakaleId = this.makaleId;
    yorum.UyeId = uyeId;
    yorum.YorumIcerik = yorumMetni;
    yorum.Tarih = new Date();

    this.apiServis.YorumEkle(yorum).subscribe((d: Sonuc) => {
      if (d.islem) {
        this.MakaleYorumListe();
      }
    });
  }
}
