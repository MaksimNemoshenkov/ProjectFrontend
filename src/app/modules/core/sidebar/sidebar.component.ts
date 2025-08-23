import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../auth/services/client/auth.service";
import {Router} from "@angular/router";
import {MapElement} from "./MapElement";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  links: Map<string | null, [MapElement]> = new Map<string, [MapElement]> ();

  constructor(private tokenService: AuthService, public router: Router) {
    this.links.set(null, [{name: "Cocktails", link: "/dishes", icon: "coffee"}]);
    // @ts-ignore
    this.links.set("USER", [{name: "Stock", link: "/personal-stock", icon: "container"},
                            {name: "Friends", link: "/user/friends", icon: "team"},
                            {name: "Cocktails", link: "/dishes", icon: "coffee"},
                            {name: "Favourites", link: "/user/favourite", icon: "heart"},

    ]);
    // @ts-ignore
    this.links.set("MODERATOR", [{name: "Cocktails", link: "/moderator/cocktails", icon: "coffee"},
                                 {name: "Ingredients", link: "/moderator/ingredients", icon: "apple"},
                                 {name: "Kitchenware", link: "/moderator/kitchenware", icon: "experiment"},

    ]);
    // @ts-ignore
    this.links.set("ADMIN", [{name: "Cocktails", link: "/moderator/cocktails", icon: "coffee"},
                             {name: "Ingredients", link: "/moderator/ingredients", icon: "apple"},
                             {name: "Kitchenware", link: "/moderator/kitchenware", icon: "experiment"},
                             {name: "Moderators", link: "/admin/moderators", icon: "audit"},

    ])
  }

  get userType() {
    return this.tokenService.getUserRole();
  }

}
