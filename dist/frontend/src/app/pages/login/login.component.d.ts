import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
export declare class LoginComponent {
    private fb;
    private authService;
    private router;
    loginForm: FormGroup;
    isLoading: boolean;
    errorMessage: string;
    constructor(fb: FormBuilder, authService: AuthService, router: Router);
    get username(): import("@angular/forms").AbstractControl<any, any>;
    get password(): import("@angular/forms").AbstractControl<any, any>;
    onSubmit(): void;
}
