import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, RouterOutlet, Router } from '@angular/router';
import { Traitement } from 'src/app/models/traitement.model';

@Component({
  selector: 'app-filtered-traitements',
  templateUrl: './filtered-traitements.component.html',
  styleUrls: ['./filtered-traitements.component.css']
})
export class FilteredTraitementsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['login', 'nomPatient', 'typeTraitement', 'dateCreation', 'etape'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  listTraitements: Array<Traitement> = [];
  isDataLoaded = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routerOutlet: RouterOutlet
  ) {

  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.initData();
    });
  }

  initData() {
    this.isDataLoaded = false;
    this.listTraitements = [];
    for (let item of this.activatedRoute.snapshot.data.value) {
      if (item) {
        this.listTraitements = this.listTraitements.concat(item.content);
        this.dataSource.data = this.listTraitements;
      } else {
        this.logout();
        return;
      }
    }
    this.isDataLoaded = true;
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
