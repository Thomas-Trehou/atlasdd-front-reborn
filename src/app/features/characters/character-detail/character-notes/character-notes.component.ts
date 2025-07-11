import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Note, NoteCreateRequest} from '../../../../core/models/note';
import {CharacterService} from '../../../../services/character/character.service';
import {CharacterNoteService} from '../../../../services/character/character-notes.service';

@Component({
  selector: 'app-character-notes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './character-notes.component.html',
  styleUrls: ['./character-notes.component.scss']
})
export class CharacterNotesComponent implements OnInit {
  @Input() characterId!: number;
  @Input() notes: Note[] = [];
  @Input() characterType!: 'ogl5' | 'custom'; // Ajout du type de personnage
  @Input() isReadOnly: boolean = false;
  @Output() notesUpdated = new EventEmitter<Note[]>();

  noteForm!: FormGroup;
  isAddingNote: boolean = false;
  editingNoteId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private characterNoteService: CharacterNoteService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(note?: Note): void {
    this.noteForm = this.fb.group({
      title: [note?.title || '', Validators.required],
      content: [note?.content || '', Validators.required]
    });
  }

  startAddNote(): void {
    this.isAddingNote = true;
    this.editingNoteId = null;
    this.initForm();
  }

  startEditNote(note: Note): void {
    this.isAddingNote = false;
    this.editingNoteId = note.id;
    this.initForm(note);
  }

  cancelNoteAction(): void {
    this.isAddingNote = false;
    this.editingNoteId = null;
  }

  saveNote(): void {
    if (this.noteForm.valid) {
      if (this.isAddingNote) {
        this.addNote();
      } else if (this.editingNoteId) {
        this.updateNote();
      }
    }
  }

  private addNote(): void {
    const newNote: NoteCreateRequest = this.noteForm.value;

    this.characterNoteService.saveCharacterNotes(this.characterId, newNote, this.characterType
    ).subscribe({
      next: (createdNote) => {
        this.notes = [...this.notes, createdNote];
        this.notesUpdated.emit(this.notes);
        this.isAddingNote = false;
        this.initForm();
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout de la note', err);
      }
    });
  }

  private updateNote(): void {
    if (!this.editingNoteId) return;

    const updatedNote = {
      id: this.editingNoteId,
      ...this.noteForm.value
    };

    this.characterNoteService.updateCharacterNote(this.editingNoteId, updatedNote).subscribe({
      next: (result) => {
        this.notes = this.notes.map(note =>
          note.id === this.editingNoteId ? result : note
        );
        this.notesUpdated.emit(this.notes);
        this.editingNoteId = null;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour de la note', err);
      }
    });
  }

  deleteNote(noteId: number): void {
    this.characterNoteService.deleteCharacterNote(noteId).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.id !== noteId);
        this.notesUpdated.emit(this.notes);
      },
      error: (err) => {
        console.error('Erreur lors de la suppression de la note', err);
      }
    });
  }
}
