import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Note, NoteCreateRequest} from '../../../core/models/note';
import {CampaignService} from '../../../services/campaign/campaign.service';
import {UserService} from '../../../services/user/user.service';

@Component({
  selector: 'app-campaign-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './campaign-notes.component.html',
  styleUrl: './campaign-notes.component.scss'
})
export class CampaignNotesComponent implements OnInit {
  @Input() campaignId!: number;

  notes: Note[] = [];
  noteForm!: FormGroup;
  isAddingNote = false;
  editingNoteId: number | null = null;
  private currentUserId!: number;

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const currentUser = this.userService.currentUser;
    if (currentUser && currentUser.id) {
      this.currentUserId = currentUser.id;
      this.initForm();
      this.loadNotes();
    }
  }

  private loadNotes(): void {
    if (!this.campaignId || !this.currentUserId) return;
    this.campaignService.getNotesForCampaign(this.campaignId, this.currentUserId).subscribe(notes => {
      this.notes = notes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    });
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
    if (!this.noteForm.valid) return;

    if (this.isAddingNote) {
      const newNote: NoteCreateRequest = this.noteForm.value;
      this.campaignService.addNoteToCampaign(this.campaignId, this.currentUserId, newNote).subscribe(createdNote => {
        this.notes.unshift(createdNote); // Ajoute au début
        this.cancelNoteAction();
      });
    } else if (this.editingNoteId) {
      const updatedNote: Partial<NoteCreateRequest> = this.noteForm.value;
      this.campaignService.updateNote(this.editingNoteId, updatedNote).subscribe(result => {
        const index = this.notes.findIndex(n => n.id === this.editingNoteId);
        if (index > -1) {
          this.notes[index] = result;
        }
        this.cancelNoteAction();
      });
    }
  }

  deleteNote(noteId: number): void {
    if(confirm('Voulez-vous vraiment supprimer cette note ?')) {
      this.campaignService.deleteNote(noteId).subscribe(() => {
        this.notes = this.notes.filter(note => note.id !== noteId);
      });
    }
  }
}
