import { OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
export declare class AppComponent implements OnInit, OnDestroy {
    private authService;
    private router;
    title: string;
    isLoggedIn: boolean;
    private authSubscription;
    constructor(authService: AuthService, router: Router);
    ngOnInit(): void;
    ngOnDestroy(): void;
    logout(event: Event): void;
}
