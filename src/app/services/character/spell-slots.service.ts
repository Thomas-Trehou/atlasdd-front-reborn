import { Injectable } from '@angular/core';
import {SpellcasterType} from '../../core/enums/SpellcasterType';
import {SpellSlotLevels, SpellSlots} from '../../core/models/character/spell-slots';

@Injectable({
  providedIn: 'root'
})
export class SpellSlotsService {

  constructor() { }

  /**
   * Calcule les emplacements de sorts en fonction du type de lanceur et du niveau
   */
  calculateSpellSlots(spellcasterType: SpellcasterType, level: number): SpellSlotLevels {
    switch (spellcasterType) {
      case SpellcasterType.FULL_CASTER:
        return this.getFullCasterSlots(level);
      case SpellcasterType.HALF_CASTER:
        return this.getHalfCasterSlots(level);
      case SpellcasterType.THIRD_CASTER:
        return this.getThirdCasterSlots(level);
      case SpellcasterType.NON_CASTER:
      default:
        return this.getEmptySlots();
    }
  }

  /**
   * Emplacements de sorts pour un lanceur complet (niveau effectif = niveau de classe)
   */
  private getFullCasterSlots(level: number): SpellSlotLevels {
    return this.getSlotsByEffectiveLevel(level);
  }

  /**
   * Emplacements de sorts pour un demi-lanceur (niveau effectif = niveau de classe ÷ 2, arrondi au supérieur)
   */
  private getHalfCasterSlots(level: number): SpellSlotLevels {
    const effectiveLevel = Math.ceil(level / 2);
    return this.getSlotsByEffectiveLevel(effectiveLevel);
  }

  /**
   * Emplacements de sorts pour un initié à la magie (niveau effectif = niveau de classe ÷ 3, arrondi au supérieur)
   */
  private getThirdCasterSlots(level: number): SpellSlotLevels {
    const effectiveLevel = Math.ceil(level / 3);
    return this.getSlotsByEffectiveLevel(effectiveLevel);
  }

  /**
   * Table des emplacements de sorts selon le niveau effectif
   */
  private getSlotsByEffectiveLevel(effectiveLevel: number): SpellSlotLevels {
    // Table basée sur les règles du SRD/PHB
    const slotsTable: Record<number, SpellSlotLevels> = {
      0: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 },
      1: { '1': 2, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 },
      2: { '1': 3, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 },
      3: { '1': 4, '2': 2, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 },
      4: { '1': 4, '2': 3, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 },
      5: { '1': 4, '2': 3, '3': 2, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 },
      6: { '1': 4, '2': 3, '3': 3, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 },
      7: { '1': 4, '2': 3, '3': 3, '4': 1, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 },
      8: { '1': 4, '2': 3, '3': 3, '4': 2, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 },
      9: { '1': 4, '2': 3, '3': 3, '4': 3, '5': 1, '6': 0, '7': 0, '8': 0, '9': 0 },
      10: { '1': 4, '2': 3, '3': 3, '4': 3, '5': 2, '6': 0, '7': 0, '8': 0, '9': 0 },
      11: { '1': 4, '2': 3, '3': 3, '4': 3, '5': 2, '6': 1, '7': 0, '8': 0, '9': 0 },
      12: { '1': 4, '2': 3, '3': 3, '4': 3, '5': 2, '6': 1, '7': 0, '8': 0, '9': 0 },
      13: { '1': 4, '2': 3, '3': 3, '4': 3, '5': 2, '6': 1, '7': 1, '8': 0, '9': 0 },
      14: { '1': 4, '2': 3, '3': 3, '4': 3, '5': 2, '6': 1, '7': 1, '8': 0, '9': 0 },
      15: { '1': 4, '2': 3, '3': 3, '4': 3, '5': 2, '6': 1, '7': 1, '8': 1, '9': 0 },
      16: { '1': 4, '2': 3, '3': 3, '4': 3, '5': 2, '6': 1, '7': 1, '8': 1, '9': 0 },
      17: { '1': 4, '2': 3, '3': 3, '4': 3, '5': 2, '6': 1, '7': 1, '8': 1, '9': 1 },
      18: { '1': 4, '2': 3, '3': 3, '4': 3, '5': 3, '6': 1, '7': 1, '8': 1, '9': 1 },
      19: { '1': 4, '2': 3, '3': 3, '4': 3, '5': 3, '6': 2, '7': 1, '8': 1, '9': 1 },
      20: { '1': 4, '2': 3, '3': 3, '4': 3, '5': 3, '6': 2, '7': 2, '8': 1, '9': 1 }
    };

    // Gérer les niveaux hors limites
    if (effectiveLevel <= 0) return slotsTable[0];
    if (effectiveLevel > 20) return slotsTable[20];

    return slotsTable[effectiveLevel];
  }

  /**
   * Retourne des emplacements vides pour un non-lanceur
   */
  private getEmptySlots(): SpellSlotLevels {
    return { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0 };
  }

  /**
   * Crée une structure SpellSlots complète avec des emplacements utilisés à zéro
   */
  createSpellSlots(spellcasterType: SpellcasterType, level: number): SpellSlots {
    const slots = this.calculateSpellSlots(spellcasterType, level);
    return {
      slots,
      slotsUsed: this.getEmptySlots() // Tous les emplacements utilisés sont à 0 par défaut
    };
  }
}

