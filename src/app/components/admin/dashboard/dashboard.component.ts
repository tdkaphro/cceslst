import { TraitementStep } from './../../../models/traitement-step.model';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import * as Chart from 'chart.js'
import { Traitement } from 'src/app/models/traitement.model';
import { UserInfo as Praticien } from 'src/app/models/user-info.model';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  chartTrtByDate: Chart;

  traitementsResult: any;
  stepsResult: any;
  activePraticien: any;
  inactivePraticien: any;

  listTraitements: Array<Traitement> = [];
  listPraticiens: Array<Praticien> = [];
  listSteps: Array<TraitementStep> = [];
  stepsLabels;
  trtByDateData: any[] = [];
  years: any[];

  userByStatusData: number[] = [];
  userByTrtNbrData: number[] = [];
  trtByStepNbrData: number[] = [];

  stepsProd = [8, 9, 10, 13];
  traitementProd: Array<any> = [];

  selectedYear: number;

  displayedColumns: string[] = ['ordre', 'nom', 'count'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

  canvas: any;
  ctx: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routerOutlet: RouterOutlet,
    private cdRef : ChangeDetectorRef
  ) {
    this.activePraticien = this.activatedRoute.snapshot.data.value[0];
    this.inactivePraticien = this.activatedRoute.snapshot.data.value[1];
    this.traitementsResult = this.activatedRoute.snapshot.data.value[2];
    this.stepsResult = this.activatedRoute.snapshot.data.value[3];

    // console.log('this.activePraticien === ', this.activePraticien);
    // console.log('this.inactivePraticien === ', this.inactivePraticien);
    //console.log('this.traitementsResult === ', this.traitementsResult);
    //console.log('this.stepsResult === ', this.stepsResult);

    if (this.traitementsResult && this.stepsResult && this.activePraticien && this.inactivePraticien) {
      this.listPraticiens = this.activePraticien.content.filter(user => user.etat !== 'B');
      this.listTraitements = this.traitementsResult.content;
      this.listSteps = this.stepsResult.content;

      this.filterTraitementProd();

      // users by status
      this.userByStatusData.push(this.listPraticiens.length);
      this.userByStatusData.push(this.inactivePraticien.content.length);
      this.userByStatusData.push(this.activePraticien.content.filter(user => user.etat === 'B').length);

      // users by traitement nbr
      const activePraticienCount = this.getActivePraticienCount();
      this.userByTrtNbrData.push(activePraticienCount);
      this.userByTrtNbrData.push(this.listPraticiens.length - activePraticienCount);

      // traitements by steps
      this.generateStepsLabel();
      this.generateStepData();

      // traitements by date of creation
      this.generateTrtByDateData();
      this.selectedYear = 0;
    } else {
      this.logout();
    }
  }

  ngOnInit() {
    Chart.plugins.unregister(ChartDataLabels);
  }

  filterTraitementProd() {
    this.traitementProd = [];
    this.listTraitements.forEach(element => {
      if (this.stepsProd.includes(element.etape.idEtape)) {
        let index = -1;
        if (this.traitementProd.length > 0) {
          index = this.traitementProd.findIndex(item => item.praticien.login.trim().toLowerCase() === element.userCre.login.trim().toLowerCase());
        }
        if (index === -1) {
          let praticien = this.listPraticiens.find(value => value.login.trim().toUpperCase() == element.login.trim().toUpperCase());
          this.traitementProd.push({ praticien: praticien, count: 1 });
        } else {
          this.traitementProd[index].count++;
        }
      }
    });
    this.traitementProd.sort((a, b) => (a.count > b.count ? -1 : 1));
    this.dataSource.data = this.traitementProd;
  }

  getActivePraticienCount() {
    let nbr = 0;
    this.listPraticiens.forEach(praticien => {
      if (this.isLoginExist(praticien.login))
        nbr++;
    });
    return nbr;
  }

  isLoginExist(login: string) {
    for (let traitement of this.listTraitements) {
      if (traitement.login.toUpperCase() === login.toUpperCase())
        return true;
    }
    return false;
  }

  generateStepsLabel() {
    this.stepsLabels = new Set();
    this.listSteps.forEach(step => {
      this.stepsLabels.add(step.libEtape);
    });
    return this.stepsLabels;
  }

  generateStepData() {
    for (let step of [...this.stepsLabels]) {
      this.trtByStepNbrData.push(this.getStepCount(step));
    }
  }

  getStepCount(step: string) {
    let count = 0;
    this.listTraitements.forEach(traitement => {
      if (traitement.etape.libEtape === step)
        count++;
    });
    return count;
  }

  generateTrtByDateData() {
    this.trtByDateData = [];
    this.years = this.getYears();
    this.years.forEach(year => {
      const months = this.getMonthsByYear(year);
      let nbrTrt = [];
      months.forEach(month => {
        nbrTrt.push(this.getNbrTrtByDate(year, month));
      });
      const monthsLabels = this.refactorMonths(months);
      this.trtByDateData.push({ year: year, labels: monthsLabels, data: nbrTrt });
    });
  }

  getYears() {
    var labels = new Set();
    this.listTraitements.forEach(element => {
      let date = new Date(element.dateCreation);
      labels.add(date.getFullYear());
    });
    return [...labels].sort((a, b) => (a > b ? -1 : 1));
  }

  getMonthsByYear(year) {
    var labels = new Set();
    this.listTraitements.forEach(element => {
      const date = new Date(element.dateCreation);
      if (date.getFullYear() == year)
        labels.add(date.getMonth());
    });
    return [...labels].sort();
  }

  getNbrTrtByDate(year, month) {
    var nbr = 0;
    this.listTraitements.forEach(element => {
      const date = new Date(element.dateCreation);
      if (date.getFullYear() == year && date.getMonth() === month)
        nbr++
    });
    return nbr;
  }

  refactorMonths(values: any[]) {
    let result = [];
    values.forEach(element => {
      result.push(this.months[element]);
    });
    return result;
  }

  ngAfterViewInit() {
    this.initChartUserByStatus();
    this.initChartUserByTraitements();
    this.initChartTrtByStatus();
    this.initChartTrtByDate();
    this.dataSource.paginator = this.paginator;
    this.cdRef.detectChanges();
  }

  initChartUserByStatus() {
    this.canvas = document.getElementById('chartUserByStatus');
    this.ctx = this.canvas.getContext('2d');
    let myChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: ["Confirmé", "Non Confirmé", "Bloqué"],
        datasets: [{
          data: this.userByStatusData,
          backgroundColor: ['rgba(56, 142, 60, 1)', 'rgba(245, 124, 0, 1)', 'rgba(211, 47, 47, 1)'],
          borderWidth: 1
        }]
      },
      plugins: [ChartDataLabels],
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              let dataArr = ctx.chart.data.datasets[0].data;
              let sum = 0;
              dataArr.forEach(element => {
                sum += element;
              });
              return (value * 100 / sum).toFixed(2) + "%";
            },
            color: '#fff',
          }
        }
      }
    });
  }

  initChartUserByTraitements() {
    this.canvas = document.getElementById('chartUserByTrt');
    this.ctx = this.canvas.getContext('2d');
    let myChart = new Chart(this.ctx, {
      type: 'pie',
      data: {
        labels: ["Actif", "Passif"],
        datasets: [{
          label: '# of Votes',
          data: this.userByTrtNbrData,
          backgroundColor: ['rgba(56, 142, 60, 1)', 'rgba(211, 47, 47, 1)'],
          borderWidth: 1
        }]
      },
      plugins: [ChartDataLabels],
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              let dataArr = ctx.chart.data.datasets[0].data;
              let sum = 0;
              dataArr.forEach(element => {
                sum += element;
              });
              return (value * 100 / sum).toFixed(2) + "%";
            },
            color: '#fff',
          }
        }
      }
    });
  }

  initChartTrtByStatus() {
    this.canvas = document.getElementById('chartTrtByStatus');
    this.ctx = this.canvas.getContext('2d');
    let myChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: [...this.stepsLabels],
        datasets: [{
          label: "Traitements",
          backgroundColor: "#0079a4",
          data: this.trtByStepNbrData
        }]
      },
      plugins: [ChartDataLabels],
      options: {
        responsive: false,
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              let dataArr = ctx.chart.data.datasets[0].data;
              let sum = 0;
              dataArr.forEach(element => {
                sum += element;
              });
              return (value * 100 / sum).toFixed(2) + "%";
            },
            color: 'rgb(255, 180, 0)',
          }
        }
      }
    });
  }

  initChartTrtByDate() {
    this.canvas = document.getElementById('chartTrtByDate');
    this.ctx = this.canvas.getContext('2d');
    this.chartTrtByDate = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: this.trtByDateData[0].labels,
        datasets: [{
          data: this.trtByDateData[0].data,
          label: "Traitements",
          borderColor: "#0079a4",
          fill: false
        }]
      },
      options: { responsive: false, maintainAspectRatio: true }
    });
  }

  onYearSelected() {
    this.chartTrtByDate.data.labels = this.trtByDateData[this.selectedYear].labels;
    this.chartTrtByDate.data.datasets.forEach((dataset) => {
      dataset.data = this.trtByDateData[this.selectedYear].data;
    });
    this.chartTrtByDate.update();
  }

  logout() {
    localStorage.removeItem('token_auth');
    localStorage.removeItem('user_data');
    this.routerOutlet.deactivate();
    this.router.navigate(['/auth']);
  }


}
