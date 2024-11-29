import React, { Component } from "react";
import { isRecord } from './record';
import { EventDisplay } from './EventDisplay';
import { EventDetails, toJson, Event, fromJson } from './events';
import { AddEvent } from './AddEvent';
import { GetTickets } from './GetTickets';

/** Describes set of possible app page views. */
type Page = {kind: "EventDisplay"} | {kind: "AddEvent"} | {kind: "GetTickets"};

/** Callback function to retrieve sporting event names and event data from server. */
type ListCallback = (names: string[], events: Event[]) => void;

/** Callback function to update the server with new data (add event, get tickets) */
type UpdateCallback = (name: string, saved: boolean) => void;

type OlympicAppState = {
  /** Stores state of the current page of the app to show. */
  show: Page;

  /** Stores state of all the sporting event names. */
  eventNames: string[];

  /** Stores state of all the sporting event names and their data. */
  events: Event[];
}

/** Displays the UI of the Olympic rsvp application. */
export class OlympicApp extends Component<{}, OlympicAppState> {

  constructor(props: {}) {
    super(props);

    this.state = {show: {kind: "EventDisplay"}, eventNames: [], events: []};
  }

  // Called when the server loads to get the most recent data from the server
  componentDidMount = (): void => {
    this.doRetrieveEventsClick(this.doRefreshResponse);
  };

  render = (): JSX.Element => {
    if (this.state.show.kind === "EventDisplay") {
      return <div><EventDisplay events={this.state.events} onAddClick={this.doAddDisplayClick}
      onTicketClick={this.doTicketDisplayClick} onRefreshClick={this.doRefreshClick}></EventDisplay></div>;
    } else if (this.state.show.kind === "GetTickets") {
      return <div><GetTickets database={this.state.eventNames} onBack={this.doBackClick} onGet={this.doGetTicketsClick}></GetTickets> </div>
    } else {
      return <div><AddEvent onCreate={this.doCreateEventClick} onBack = {this.doBackClick}></AddEvent></div>;
    }
  };

  // Calls the server to add a new sporting event with the provided information to the site
  doCreateEventClick = (event: string, sport: string, description: string, date: string, venue: string, tickets: string): void => {
    console.log("created new event");
    const name = event + " (" + sport + ")";
    const details:EventDetails = {sport: sport, event: event, ticketsLeft: BigInt(tickets), ticketsSold: 0n,
        date: BigInt(date), description: description, venue: venue};
    const update = this.state.events.concat({eventName: name, details: details});
    update.sort((a, b) => Number(a.details.date) - Number(b.details.date));
    this.setState({events: update});
    this.doUpdateEventClick(name, details, this.doUpdateStorageResp);
  };

  // Calls the server to update the ticket count when tickets are booked for the given event
  doGetTicketsClick = (name: string, details: EventDetails): void => {
    console.log("got tickets!");
    // Inv: for each event of this.state.events[0 .. i-1], this.state.events preserves its original contents
    // unless event.eventName = name, replacing that event with the updated event
    for (const event of this.state.events) {
      if (event.eventName === name) {
        const update = this.state.events.slice(0, this.state.events.indexOf(event)).concat({eventName: name,
            details: details}).concat(this.state.events.slice(this.state.events.indexOf(event) + 1));
        this.setState({events: update});
        break;
      }
    }
    this.doUpdateEventClick(name, details, this.doUpdateStorageResp);
  };

  // Updates the list of sporting event names and list of event names + data after updating in server
  doUpdateStorageResp = (name: string, saved: boolean): void => {
    this.doRetrieveEventsClick(this.doRefreshResponse);
    if (saved) {
      console.log("updated tickets of event " + name);
    } else {
      console.log("added event " + name);
    }
  };
  
  // Accesses the /update server, and passes in sporting event name and details to add to the server
  // Passes in the sporting event name and confirmation (boolean) when completed
  doUpdateEventClick = (name: string, details: EventDetails, cb: UpdateCallback): void => {
    const body = {name: name, content: toJson(details)};
    fetch("/api/update", {method: 'POST', body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}})
      .then((res) => this.doUpdateEventResp(name, res, cb))
      .catch(() => this.doUpdateEventError("failed to connect to server"));
  };

  // Called when the server responds to a request to update with the latest info
  doUpdateEventResp = (name: string, res: Response, cb: UpdateCallback): void => {
    if (res.status === 200) {
      res.json().then((val) => this.doUpdateEventJson(name, val, cb))
        .catch(() => this.doUpdateEventError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doUpdateEventError)
        .catch(() => this.doUpdateEventError("400 response is not text"));
    } else {
      this.doUpdateEventError(`bad status code: ${res.status}`);
    }
  };

  // Called when the update response JSON has been parsed
  doUpdateEventJson = (name: string, val: unknown, cb: UpdateCallback): void => {
    if (!isRecord(val) || typeof val.saved !== 'boolean') {
      console.error('Invalid JSON from /api/update', val);
      return;
    }
    cb(name, val.saved);
  };

  // Called when there is an error updating the server with the latest info
  doUpdateEventError = (msg: string): void => {
    console.error(`Error fetching /api/update: ${msg}`);
  };

  // Sets the page back to the EventDisplay page (back-clicking, no changes made)
  doBackClick = (): void => {
    this.setState({show: {kind: "EventDisplay"}});
  };

  // Sets the page to the AddEvent page to add events
  doAddDisplayClick = (): void => {
    this.setState({show: {kind: "AddEvent"}});
  };

  // Sets the page to the GetTickets page to get tickets for a given event
  doTicketDisplayClick = (): void => {
    this.setState({show: {kind: "GetTickets"}});
  };

  // Calls the server to display the most updated information on the EventDisplay page
  doRefreshClick = (): void => {
    console.log("refresh button works");
    this.doRetrieveEventsClick(this.doRefreshResponse);
  };

  // Accesses the /names server, and retrieves the list of sporting event names and the list of sporting event data
  // Passes in both retrieved lists when completed
  doRetrieveEventsClick = (cb: ListCallback): void => {
    fetch("/api/names")
      .then((res) => this.doRetrieveEventsResp(res, cb))
      .catch(() => this.doRetrieveEventsError("failed to connect to server"));
  };

  // Called when the server responds to a request to retrieve both lists
  doRetrieveEventsResp = (res: Response, cb: ListCallback): void => {
    if (res.status === 200) {
      res.json().then((val) => this.doRetrieveEventsJson(val, cb))
        .catch(() => this.doRetrieveEventsError("200 response is not JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doRetrieveEventsError)
        .catch(() => this.doRetrieveEventsError("400 response is not text"));
    } else {
      this.doRetrieveEventsError(`bad status code: ${res.status}`);
    }
  };

  // Called when the names response JSON has been parsed
  doRetrieveEventsJson = (val: unknown, cb: ListCallback): void => {
    if (!isRecord(val) || !Array.isArray(val.names) || !Array.isArray(val.events)) {
      console.error('Invalid JSON from /api/names', val);
    } else {
      const names: string[] = [];
      // Inv: names contains name for each of val.name[0 .. i-1] if it is a string
      for (const name of val.names) {
        if (typeof name === 'string') {
          names.push(name);
        } else {
          console.error('Invalid name from /api/names', name);
          return;
        }
      }
      const events: Event[] = [];
      // Inv: events contains a record containing the formatted sporting event name and event
      // (converted from JSON) for each of val.events[0 .. i-1] if event is an array
      for (const event of val.events) {
        if (Array.isArray(event)) {
          const update = fromJson(event);
          const name = update.event + " (" + update.sport + ")";
          events.push({eventName: name, details: update});
        } else {
          console.error('Invalid event from /api/names', event);
        }
      }
      events.sort((a, b) => Number(a.details.date) - Number(b.details.date));
      cb(names, events);
    }
  };

  // Called when there is an error retrieving both lists from the server
  doRetrieveEventsError = (msg: string): void => {
    console.error(`Error fetching /api/names: ${msg}`);
  };

  // Sets state to the EventDisplay page with the most updated lists of sporting event names and events
  doRefreshResponse = (names: string[], events: Event[]): void => {
    console.log('entering the refresh response');
    this.setState({show: {kind: "EventDisplay"}, eventNames: names, events: events});
  };
}