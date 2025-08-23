import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Cloudinary, CloudinaryImage} from "@cloudinary/url-gen";
import {AuthService} from "../../auth/services/client/auth.service";
import {thumbnail} from "@cloudinary/url-gen/actions/resize";
import {byRadius} from "@cloudinary/url-gen/actions/roundCorners";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService) {
  }

  private readonly TOKEN_KEY: string = "AUTH_TOKEN";
  private readonly USER_ID: string = "USER_ID";
  private readonly USER_FIRSTNAME: string = "USER_FIRSTNAME";
  private readonly USER_LASTNAME: string = "USER_LASTNAME";
  private readonly USER_ROLE: string = "USER_ROLE";
  private readonly USER_IMAGE_ID: string = "USER_IMAGE_ID";
  private readonly THEME_KEY: string = "THEME_MODE";
  
  public imageId: string = "";
  public img: CloudinaryImage = this.initImage();
  public firstname: string = "";
  public lastname: string = "";
  public isDarkMode: boolean = false;

  logOut() {
    localStorage.clear();
    this.goToLogIn();
  }

  ngOnInit(): void {
    console.log('Header component initialized');
    this.imageId = this.authService.getImageId();
    this.img = this.initImage();
    this.firstname = this.authService.getUserFirstname();
    this.lastname = this.authService.getUserLastname();
    console.log('User info loaded:', { firstname: this.firstname, lastname: this.lastname, userType: this.userType });
    this.loadTheme();
    
    // Добавляем слушатель для автоматического применения темы
    this.setupThemeObserver();
  }

  initImage(): CloudinaryImage {
    const cld = new Cloudinary({cloud: {cloudName: 'djcak19nu'}});
    return cld.image(this.imageId)
      .resize(thumbnail().width(50).height(50))
      .roundCorners(byRadius(25));
  }

  get userType() {
    return this.authService.getUserRole();
  }

  goToLogIn() {
    this.router.navigate(['/login']);
  }

  goToSignUp() {
    this.router.navigate(['/signup']);
  }

  upSearch(value: string) {
    // Здесь можно добавить логику поиска
    console.log('Search value:', value);
    // Можно эмитить событие для родительского компонента
    // или использовать сервис для поиска
  }

  toggleTheme() {
    console.log('Toggle theme clicked, current mode:', this.isDarkMode);
    this.isDarkMode = !this.isDarkMode;
    console.log('New mode:', this.isDarkMode);
    this.saveTheme();
    this.applyTheme();
  }

  private loadTheme() {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    console.log('Loading theme from localStorage:', savedTheme);
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
      console.log('Setting isDarkMode to:', this.isDarkMode);
      this.applyTheme();
    } else {
      console.log('No saved theme found, using default light mode');
    }
  }

  private saveTheme() {
    localStorage.setItem(this.THEME_KEY, this.isDarkMode ? 'dark' : 'light');
  }

  private applyTheme() {
    // Применяем тему к body для глобальных стилей
    if (this.isDarkMode) {
      document.body.classList.add('dark-theme');
      console.log('Applied dark theme to body');
    } else {
      document.body.classList.remove('dark-theme');
      console.log('Applied light theme to body');
    }
    
    // Применяем тему к конкретным компонентам
    setTimeout(() => {
      const header = document.querySelector('.header') as HTMLElement;
      const sidebar = document.querySelector('.navigation') as HTMLElement;
      const footer = document.querySelector('.footer') as HTMLElement;
      
      console.log('Found elements:', {
        header: !!header,
        sidebar: !!sidebar,
        footer: !!footer
      });
      
      if (this.isDarkMode) {
        header?.classList.add('dark-theme');
        sidebar?.classList.add('dark-theme');
        footer?.classList.add('dark-theme');
        console.log('Applied dark theme to components');
      } else {
        header?.classList.remove('dark-theme');
        sidebar?.classList.remove('dark-theme');
        footer?.classList.remove('dark-theme');
        console.log('Applied light theme to components');
      }
    }, 100); // Небольшая задержка для гарантии загрузки DOM
  }

  private setupThemeObserver() {
    // Создаем наблюдатель за изменениями в DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // При появлении новых узлов применяем тему
          this.applyThemeToNewElements();
        }
      });
    });
    
    // Начинаем наблюдение за body
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Добавляем периодическую проверку каждые 2 секунды
    setInterval(() => {
      this.applyThemeToNewElements();
    }, 2000);
    
    console.log('Theme observer setup complete');
  }

  private applyThemeToNewElements() {
    if (this.isDarkMode) {
      // Применяем темную тему к новым элементам
      const newSidebar = document.querySelector('.navigation:not(.dark-theme)') as HTMLElement;
      const newFooter = document.querySelector('.footer:not(.dark-theme)') as HTMLElement;
      
      if (newSidebar) {
        newSidebar.classList.add('dark-theme');
        console.log('Applied dark theme to new sidebar');
      }
      
      if (newFooter) {
        newFooter.classList.add('dark-theme');
        console.log('Applied dark theme to new footer');
      }
    }
  }
}
