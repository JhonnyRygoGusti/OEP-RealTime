import { ComputingService } from './../../services/computing.service';
import { Table } from './../../models/table';
import { PoliticParty } from './../../models/politic-party';
import { Component, HostListener, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { NgxSpinnerService } from "ngx-spinner";
import 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss']
})

export class ResultadosComponent implements OnInit {

  politicParties: [PoliticParty];
  table: Table[];
  updateDate: string;
  correct: boolean;
  loading: boolean;
  percentagePolitic: number[];
  percentajeGeneral: number;

  //chart
  barChartOptions: ChartOptions = {
    responsive: true,
    animation: {
      duration: 0,
      animateScale: false,
    },
    plugins: {
      datalabels: {
        color: 'black',
        align: 'end',
        backgroundColor: 'white',
        padding: 2,
        opacity: 0.8,
        borderRadius: 5,
        formatter: (value, context) => {
          return `${this.percentagePolitic[context.dataIndex]} %`;
        }
      }
    },
    maintainAspectRatio: false
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'horizontalBar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [];

  constructor(private computingService: ComputingService, private spinner: NgxSpinnerService) {
    this.correct = true;
    this.loading = true;
    this.updateDate = 'Cargando...';
    this.percentagePolitic = [];
    this.percentajeGeneral = 0;
  }

  ngOnInit(): void {
    this.spinner.show()
    setInterval(() => {      
      this.computingService.getData().subscribe(((data: any) => {
        this.politicParties = data.datoAdicional.grafica as [PoliticParty];
        this.table = data.datoAdicional.tabla as [Table];
        this.updateDate = data.fecha as string;
        this.correct = data.correcto as boolean;
        this.loading = false;
        this.percentajeGeneral = this.table[6].porcien;
        this.barChartLabels = this.politicParties.reduce((arrayLabels: Label[], politic: PoliticParty) => {
          arrayLabels.push(politic.nombre);
          return arrayLabels;
        }, []);
        const dataPercentaje = this.politicParties.reduce((arrayPolitic: any, politic: PoliticParty) => {
          arrayPolitic.push(politic.valor);
          this.percentagePolitic.push(politic.porcien);
          return arrayPolitic;
        }, []);
        const dataColor = this.politicParties.reduce((arrayColor: any, politic: PoliticParty) => {
          arrayColor.push(politic.color);
          return arrayColor;
        }, []);
        this.barChartData = [];
        this.barChartData.push({
          data: dataPercentaje,
          label: 'Elecciones Generales 2020',
          backgroundColor: dataColor,
          hoverBackgroundColor: dataColor,
        });
      }),
      ((error: any) => {
        this.loading = false;
        this.correct = false;
        console.log(error);
      })
      )
      this.spinner.hide()
    }, 5000)
  }
   

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth <= 1000) {
      this.barChartType = 'horizontalBar';
    } else{
      this.barChartType = 'bar';
    }
  }
}
