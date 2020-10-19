import { ComputingService } from './../../services/computing.service';
import { Table } from './../../models/table';
import { PoliticParty } from './../../models/politic-party';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.scss']
})

export class ResultadosComponent implements OnInit {

  politicParties: [PoliticParty];
  table: [Table];
  updateDate: string;
  correct: boolean;
  loading: boolean;

  //chart
  barChartOptions: ChartOptions = {
    responsive: true,
    animation: {
      duration: 0,
      animateScale: false,
    },
  };
  barChartLabels: Label[] = [];//['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { 
      data: [45, 37, 60, 70, 46, 33],
      label: 'Elecciones Generales 2020',
      backgroundColor: ['red', 'red', 'blue', 'orange', 'black', 'green'],
      
    },
  ];

  constructor(private computingService: ComputingService) {
    this.correct = true;
    this.loading = true;
    this.updateDate = Date.now().toString()
  }

  ngOnInit(): void {
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
        });
      }),
      ((error: any) => {
        this.loading = false;
        this.correct = false;
        console.log(error);
      })
      )
    }, 5000)
  }

}
