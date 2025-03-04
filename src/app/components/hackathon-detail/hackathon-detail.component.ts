import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Hackathon } from 'src/app/models/hackathon';
import { HackathonParticipationService } from 'src/app/services/hackathon-participation.service';
import { HackathonService } from 'src/app/services/hackathon.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared.module';

@Component({
  selector: 'app-hackathon-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, SharedModule],
  templateUrl: './hackathon-detail.component.html',
  styleUrls: ['./hackathon-detail.component.css'],
})
export class HackathonDetailComponent implements OnInit {
  hackathonId: number = 0;
  hackathon: Hackathon | null = null;
  isParticipant: boolean = false;
  userId: number = 1;

  constructor(
    private route: ActivatedRoute,
    private hackathonService: HackathonService,
    private participationService: HackathonParticipationService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.hackathonId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadHackathonDetail(this.hackathonId);
    this.participationService
      .isUserParticipating(this.hackathonId, this.userId)
      .subscribe((participating) => {
        this.isParticipant = participating;
      });
  }

  loadHackathonDetail(id: number): void {
    this.hackathonService.getHackathonById(id).subscribe(
      (response: Hackathon) => {
        this.hackathon = response;
      },
      (error) => {
        console.error('Error fetching hackathon:', error);
      }
    );
  }

  getMapUrl(location: string): SafeResourceUrl {
    // Construit dynamiquement l'URL de Google Maps en fonction de la localisation
    const url = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  toggleParticipation(): void {
    if (this.isParticipant) {
      this.participationService
        .unjoinHackathon(this.hackathonId, this.userId)
        .subscribe(() => {
          this.isParticipant = false;
        });
    } else {
      this.participationService
        .joinHackathon(this.hackathonId, this.userId)
        .subscribe(() => {
          this.isParticipant = true;
        });
    }
  }
}
