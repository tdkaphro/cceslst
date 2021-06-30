import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, RouterOutlet, Router } from '@angular/router';
import { Traitement } from 'src/app/models/traitement.model';

@Component({
  selector: 'app-traitements',
  templateUrl: './traitements.component.html',
  styleUrls: ['./traitements.component.css']
})
export class TraitementsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['login', 'nomPatient', 'typeTraitement', 'dateCreation', 'etape'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  listTraitements: Array<Traitement> = [];

  traitementsResult: any;
  stepsResult: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routerOutlet: RouterOutlet
  ) {

    this.traitementsResult = this.activatedRoute.snapshot.data.value[0];
    this.stepsResult = this.activatedRoute.snapshot.data.value[1];

    //console.log(this.traitementsResult);
    //console.log(this.stepsResult);

    if (this.traitementsResult && this.stepsResult) {
      this.listTraitements = this.traitementsResult.content;
      this.dataSource.data = this.listTraitements;
    } else {
      this.logout();
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}