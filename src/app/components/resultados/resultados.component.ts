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

  //chart
  barChartOptions: ChartOptions = {
    responsive: true,
    animation: {
      duration: 0,
      animateScale: false,
    },
    plugins: {
      // Change options for ALL labels of THIS CHART
      datalabels: {
        color: 'white',
        align: 'top',
        borderColor: 'white',
        font: {
          weight: 'bold',
          size: 15,
        },
        backgroundColor: '#1fb807',
        borderRadius: 5,
        formatter: (value, context) => {
          return `${this.percentagePolitic[context.dataIndex]} %`;
        }
      }
  }
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [];

  constructor(private computingService: ComputingService, private spinner: NgxSpinnerService) {
    this.correct = true;
    this.loading = true;
    this.updateDate = 'Cargando...';
    this.percentagePolitic = [];
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

        this.barChartOptions = {
          ... this.barChartOptions,
          
        }
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
    event.target.innerWidth;
    if (event.target.innerWidth <= 1000) {
      this.barChartType = 'doughnut'
    } else{
      this.barChartType = 'bar'
    }
  }
}
