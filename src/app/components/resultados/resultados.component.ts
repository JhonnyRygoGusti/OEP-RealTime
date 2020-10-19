import { ComputingService } from './../../services/computing.service';
import { Table } from './../../models/table';
import { PoliticParty } from './../../models/politic-party';
import { Component, OnInit } from '@angular/core';

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

  constructor(private computingService: ComputingService) {
    this.correct = true;
    this.loading = true;
    this.updateDate = Date.now().toString()
  }

  ngOnInit(): void {
    this.computingService.getData().subscribe(((data: any) => {
      this.politicParties = data.datoAdicional.grafica as [PoliticParty];
      this.table = data.datoAdicional.tabla as [PoliticParty];
      this.updateDate = data.fecha as string;
      this.correct = data.correcto as boolean;
      this.loading = false;
    }),
    ((error: any) => {
      this.loading = false;
      this.correct = false;
      console.log(error);
    })
    )
  }

}
