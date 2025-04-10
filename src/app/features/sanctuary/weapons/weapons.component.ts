import {Component, OnInit} from '@angular/core';
import {Weapon, WeaponProperty} from '../../../core/front-models/Weapons';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-weapons',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weapons.component.html',
  styleUrl: './weapons.component.scss'
})
export class WeaponsComponent implements OnInit {
  simpleWeapons: Weapon[] = [];
  warWeapons: Weapon[] = [];
  weaponProperties: WeaponProperty[] = [];

  // État du mode d'affichage
  activeTab: 'simple' | 'war' | 'properties' = 'simple';
  selectedWeaponType: 'all' | 'melee' | 'ranged' = 'all';

  // Propriété sélectionnée pour l'affichage du détail
  selectedProperty: WeaponProperty | null = null;

  ngOnInit(): void {
    fetch('/assets/data/simple.weapons.json')
      .then(response => response.json())
      .then(data => {
        this.simpleWeapons = data;
      });

    fetch('/assets/data/war.weapons.json')
      .then(response => response.json())
      .then(data => {
        this.warWeapons = data;
      });

    fetch('/assets/data/weapons.properties.json')
      .then(response => response.json())
      .then(data => {
        this.weaponProperties = data;
      });

    // Trier les armes par nom
    this.simpleWeapons.sort((a, b) => a.name.localeCompare(b.name));
    this.warWeapons.sort((a, b) => a.name.localeCompare(b.name));
    this.weaponProperties.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Méthodes pour filtrer les armes
  setActiveTab(tab: 'simple' | 'war' | 'properties'): void {
    this.activeTab = tab;
  }

  setWeaponType(type: 'all' | 'melee' | 'ranged'): void {
    this.selectedWeaponType = type;
  }

  // Obtenir les armes filtrées par type
  getFilteredWeapons(weapons: Weapon[]): Weapon[] {
    if (this.selectedWeaponType === 'all') {
      return weapons;
    }

    const filterType = this.selectedWeaponType === 'melee' ? 'Corps-à-corps' : 'À distance';
    return weapons.filter(weapon => weapon.weapon_range === filterType);
  }

  // Afficher les détails d'une propriété
  showPropertyDetails(property: WeaponProperty): void {
    this.selectedProperty = property;
  }

  // Extraire les propriétés d'une arme à partir de la chaîne de caractères
  getWeaponPropertiesList(propertiesString: string): string[] {
    if (!propertiesString) return [];

    // Extraire les noms des propriétés (avant les parenthèses)
    return propertiesString
      .split(', ')
      .map(prop => prop.split(' (')[0])
      .filter(prop => prop !== '');
  }
}

