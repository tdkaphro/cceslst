import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Traitement } from 'src/app/models/traitement.model';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['nomPatient', 'typeTraitement', 'dateCreation', 'etape'];
  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  listTraitements: Array<Traitement> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routerOutlet: RouterOutlet
  ) {
    let result = this.activatedRoute.snapshot.data.value;
    if (result.status && result.status === 401) {
      this.logout();
    } else {
      this.dataSource = new MatTableDataSource(this.listTraitements);
      this.listTraitements = result.content;
      this.dataSource.data = this.listTraitements;
    }
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  logout() {
    localStorage.removeItem('token_auth');
    localStorage.removeItem('user_data');
    this.routerOutlet.deactivate();
    this.router.navigate(['/auth']);
  }

  public getTypeTraitement(typeTraitement) {
    switch (typeTraitement.toUpperCase()) {
      case 'D':
        return 'Aligneurs sup/inf';
      case 'I':
        return 'Aligneurs inférieurs';
      case 'S':
        return 'Aligneurs supérieurs';
    }
  }

  addTraitement() {
    this.router.navigate(['/praticien/main/traitement']);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}