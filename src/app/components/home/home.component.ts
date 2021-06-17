import { Makale } from './../../models/Makale';
import { ApiService } from 'src/app/services/api.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Durum } from './../../models/Durum';
import { Kategori } from 'src/app/models/Kategori';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { MakaleDialogComponent } from '../dialogs/makale-dialog/makale-dialog.component';
import { MyAlertService } from 'src/app/services/myAlert.service';
import { ActivatedRoute } from '@angular/router';
import { Sonuc } from 'src/app/models/Sonuc';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  makaleler: Makale[];
  durum: Durum[];

  kategoriler: Kategori[];
  secKat: Kategori;
  katId: number;
  uyeId: number;
  dataSource: any;
  displayedColumns = ['Baslik', 'Tarih', 'UyeKadi', 'Okunma', 'detay'];
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
    this.SonEklenenler();
    this.DurumKontrol();
    this.KategoriListele();
  }

  SonEklenenler() {
    this.apiServis.MakaleListeSonEklenenler(5).subscribe((d: Makale[]) => {
      this.makaleler = d;
    });
  }
  DurumKontrol(){
    this.apiServis.durumKontrol().subscribe((d: Durum[]) => {
      this.durum = d;
      console.log(this.durum)
    });
  }
  MakaleListele() {
    this.apiServis.MakaleListeByKatId(this.katId).subscribe((d: Makale[]) => {
      this.makaleler = d;
      /*this.dataSource = new MatTableDataSource(d);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      */
    });
  }

  KategoriListele() {
    this.apiServis.KategoriListe().subscribe((d: Kategori[]) => {
      this.kategoriler = d;
    });
  }
  
  Ekle() {
    var yeniKayit: Makale = new Makale();
    this.dialogRef = this.matDialog.open(MakaleDialogComponent, {
      width: '800px',
      data: {
        kayit: yeniKayit,
        islem: 'ekle'
      }
    });
    this.dialogRef.afterClosed().subscribe(d => {
      if (d) {
        yeniKayit = d;
        yeniKayit.Foto = 'foto.jpg';
        yeniKayit.Tarih = new Date();
        yeniKayit.Okunma = 0;
        yeniKayit.UyeId = this.uyeId;
        // console.log(yeniKayit);
        this.apiServis.MakaleEkle(yeniKayit).subscribe((s: Sonuc) => {
          this.alert.AlertUygula(s);
          if (s.islem) {
            this.SonEklenenler();
          }
        });
      }
    });
  }

}
