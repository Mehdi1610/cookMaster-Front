import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, signal } from '@angular/core';


export type HomeTab = 'my-recipe' | 'favorite' | 'create';


interface TabItem{
  id: HomeTab;
  label: string;
}

@Component({
  selector: 'app-nav-tab',
  imports: [CommonModule],
  templateUrl: './nav-tab.component.html',
  styleUrl: './nav-tab.component.css',
})
export class NavTabComponent {

@Output() tabChange = new EventEmitter<HomeTab>();

tabs: TabItem[]=[
{id:'my-recipe', label:'Mes Recettes'},
{id:'favorite', label: 'Favoris'},
{id:'create', label:'Créer une Recette'}
];

activeTab= signal<HomeTab>('my-recipe');

selectTab(tab: HomeTab) {
this.activeTab.set(tab);
this.tabChange.emit(tab);
}


}
