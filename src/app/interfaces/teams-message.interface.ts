

  export interface Fact {
      name: string;
      value: string;
  }

  export interface Section {
      activityTitle: string;
      activitySubtitle: string;
      activityImage: string;
      facts?: Fact[];
      markdown: boolean;
  }

  export interface Choice {
      display: string;
      value: string;
  }

  export interface Input {
      "@type": string;
      id: string;
      isMultiline: boolean;
      title: string;
      isMultiSelect: string;
      choices: Choice[];
  }

  export interface Action {
      "@type": string;
      name: string;
      target: string;
  }

  export interface Target {
      os: string;
      uri: string;
  }

  export interface PotentialAction {
      "@type": string;
      name: string;
      inputs: Input[];
      actions: Action[];
      targets: Target[];
  }

  export interface TeamsMessageInterface {
      "@type": "MessageCard";
      "@context": "http://schema.org/extensions";
      themeColor: "0076D7";
      summary: string;
      sections: Section[];
      potentialAction?: PotentialAction[];
  }

//   {
//     "@type": "MessageCard",
//     "@context": "http://schema.org/extensions",
//     "themeColor": "0076D7",
//     "summary": "Larry Bryant created a new task",
//     "sections": [{
//         "activityTitle": "Larry Bryant created a new task",
//         "activitySubtitle": "On Project Tango",
//         "activityImage": "https://teamsnodesample.azurewebsites.net/static/img/image5.png",
//         "facts": [{
//             "name": "Assigned to",
//             "value": "Unassigned"
//         }, {
//             "name": "Due date",
//             "value": "Mon May 01 2017 17:07:18 GMT-0700 (Pacific Daylight Time)"
//         }, {
//             "name": "Status",
//             "value": "Not started"
//         }],
//         "markdown": true
//     }],
//     "potentialAction": [{
//         "@type": "ActionCard",
//         "name": "Add a comment",
//         "inputs": [{
//             "@type": "TextInput",
//             "id": "comment",
//             "isMultiline": false,
//             "title": "Add a comment here for this task"
//         }],
//         "actions": [{
//             "@type": "HttpPOST",
//             "name": "Add comment",
//             "target": "https://learn.microsoft.com/outlook/actionable-messages"
//         }]
//     }, {
//         "@type": "ActionCard",
//         "name": "Set due date",
//         "inputs": [{
//             "@type": "DateInput",
//             "id": "dueDate",
//             "title": "Enter a due date for this task"
//         }],
//         "actions": [{
//             "@type": "HttpPOST",
//             "name": "Save",
//             "target": "https://learn.microsoft.com/outlook/actionable-messages"
//         }]
//     }, {
//         "@type": "OpenUri",
//         "name": "Learn More",
//         "targets": [{
//             "os": "default",
//             "uri": "https://learn.microsoft.com/outlook/actionable-messages"
//         }]
//     }, {
//         "@type": "ActionCard",
//         "name": "Change status",
//         "inputs": [{
//             "@type": "MultichoiceInput",
//             "id": "list",
//             "title": "Select a status",
//             "isMultiSelect": "false",
//             "choices": [{
//                 "display": "In Progress",
//                 "value": "1"
//             }, {
//                 "display": "Active",
//                 "value": "2"
//             }, {
//                 "display": "Closed",
//                 "value": "3"
//             }]
//         }],
//         "actions": [{
//             "@type": "HttpPOST",
//             "name": "Save",
//             "target": "https://learn.microsoft.com/outlook/actionable-messages"
//         }]
//     }]
// }