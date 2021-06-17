import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Sonuc } from 'src/app/models/Sonuc';
import { Uye } from 'src/app/models/Uye';
import { ApiService } from 'src/app/services/api.service';
import { MyAlertService } from 'src/app/services/myAlert.service';
import { ConfirmDialogComponent } from '../../dialogs/confirm-dialog/confirm-dialog.component';
import { MakaleDialogComponent } from '../../dialogs/makale-dialog/makale-dialog.component';

@Component({
  selector: 'app-admin-uye',
  templateUrl: './admin-uye.component.html',
  styleUrls: ['./admin-uye.component.css']
})
export class AdminUyeComponent implements OnInit {

  uyeler: Uye[];
  uyeId: number;
  dataSource: any;
  displayedColumns = ['UyeId', 'Email', 'KullaniciAdi'];
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
    this.UyeListele();
    }

  UyeListele() {
    this.apiServis.UyeListe().subscribe((d: Uye[]) => {
      this.uyeler = d;
    });
  }
  Sil(kayit: Uye) {
    this.dialogRefConfirm = this.matDialog.open(ConfirmDialogComponent, {
      width: '400px',
    });
    this.dialogRefConfirm.componentInstance.dialogMesaj = kayit.KullaniciAdi + " Kullanıcı adlı üye silinecektir onaylıyor musunuz?";

    this.dialogRefConfirm.afterClosed().subscribe(d => {
      if (d) {
        this.apiServis.UyeSil(kayit.UyeId).subscribe((s: Sonuc) => {
          this.alert.AlertUygula(s);
          if (s.islem) {
          }
        });
      }
    });
  }

}
