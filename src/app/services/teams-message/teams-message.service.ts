import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

import { from } from 'rxjs';
import { Fact, Section, TeamsMessageInterface } from "src/app/interfaces/teams-message.interface";

@Injectable()
export class TeamsMessageService {
  constructor(private http: HttpClient) {

  }

  public getMainsTemplate(title?: string, sections?: any): TeamsMessageInterface {
    return {
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "themeColor": "0076D7",
      "summary": title || "",
      "sections": [sections]
    }
  }

  public getSectionsTemplate(title?: string, subtitle?: string, facts?: Fact[]): Section {
    let section: Section = {
      activityTitle: title || "",
      activitySubtitle: subtitle || "",
      activityImage: "",
      facts: facts,
      markdown: true
    };
    return section;
  }

  public postMessage(body: any) {
    environment.teamsChannel;
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    // return this.http.post(environment.teamsChannel, body, { headers });

    // ...

    return from( // wrap the fetch in a from if you need an rxjs Observable
      fetch(
        environment.teamsChannel,
        {
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          mode: 'no-cors'
        }
      )
    );
  }
}