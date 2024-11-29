import React, { Component, ChangeEvent, MouseEvent } from "react";
import { EventDetails, getSports, getEvents, fromJson } from './events';
import { isRecord } from './record';

/** Callback function to retrieve event details for the given sporting event name */
type FetchCallback = (name: string, details: EventDetails | null) => void;

type GetTicketsProps = {
    /** All the sporting event names */
    database: string[];

    /** Called to ask the parent to back-click (no changes saved) */
    onBack: () => void;

    /** Called to ask the parent to update ticket count for given sporting event */
    onGet: (name: string, details: EventDetails) => void;
}

type GetTicketsState = {
    /** The selected sport */
    sport: string;

    /** The selected event of given sport */
    event: string;

    /** Name in which tickets are bought */
    name: string;

    /** Number of tickets to buy */
    tickets: string;

    /** Retrieved event details of sporting event */
    details: EventDetails | null;
}

/** Displays the UI of the GetTickets page of the OlympicApp rsvp application */
export class GetTickets extends Component<GetTicketsProps, GetTicketsState> {
    constructor(props: GetTicketsProps) {
        super(props);
        this.state = {sport: '', event: '', name: '', tickets: '', details: null};
    }

    render = (): JSX.Element => {
        return <div>
            <h3>Get Event Tickets</h3>
            <p>{this.renderSportsDropdown()}</p>
            <p>{this.renderEventsDropdown()}</p>
            {this.renderDescriptions()}
            {this.renderNameBox()}
            {this.renderTicketsBox()}
            <button onClick = {this.doBackClick}>Back</button>
            <button onClick = {this.doGetClick}>Get Tickets</button>
        </div>;
    }

    // Renders dropdown containing all sports of the Olympics
    renderSportsDropdown = (): JSX.Element => {
        if (this.props.database.length === 0) {
            return <select value="empty"></select>;
        } else {
            const sports = getSports(this.props.database);
            const list:JSX.Element[] = [];
            list.push(<option value="" key = ""></option>);
            // Inv: list contains option for each name of sports[0 .. i-1]
            for (const name of sports) {
                list.push(<option value={name} key={name}>{name}</option>);
            }
            return <select onChange={this.doSportChangeClick}>{list}</select>;
        }
    }

    // Renders dropdown containing all events for the given sport
    renderEventsDropdown = (): JSX.Element => {
        if (this.state.sport !== '') {
            const events = getEvents(this.state.sport, this.props.database);
            if (events.length === 0) {
                return <select value="empty"></select>;
            } else {
                const list:JSX.Element[] = [];
                list.push(<option value="" key=""></option>);
                // Inv: list contains option for each name of events[0 .. i-1] 
                for (const name of events) {
                    list.push(<option value={name} key={name}>{name}</option>);
                }
                return <select onChange={this.doEventChangeClick}>{list}</select>;
            }
        }
        return <></>;
    }

    // Renders description of the sporting event
    renderDescriptions = (): JSX.Element => {
        if (this.state.sport !== '' && this.state.event !== '') {
            const name = this.state.event + " (" + this.state.sport + ")";
            this.doFetchEventDetailsClick(name, this.doGetClickResp);
            if (this.state.details !== null) {
                return <div>
                <p>Description: {this.state.details.description}</p>
                <p>Date: {"August " + this.state.details.date.toString() + ", 2024"}</p>
                <p>Venue: {this.state.details.venue}</p>
                <p>Tickets Available: {this.state.details.ticketsLeft.toString()}/{(this.state.details.ticketsLeft + this.state.details.ticketsSold).toString()}</p>
                </div>
            }
        }
        return <></>;
    }

    // Renders the input box that stores the name of person buying tickets
    renderNameBox = (): JSX.Element => {
        if (this.state.sport !== '' && this.state.event !== '') {
            return <p>Name: <input type="text" onChange = {this.doNameChange}></input></p>;
        }
        return <p></p>;
    }

    // Renders the input box that stores the number of tickets that the person wants to buy
    renderTicketsBox = (): JSX.Element => {
        if (this.state.sport !== '' && this.state.event !== '') {
            return <p>Num Tickets: <input type="number" onChange = {this.doTicketsChange}></input></p>;
        }
        return <p></p>;
    }

    // Sets sport as the inputted sport name
    doSportChangeClick = (evt: ChangeEvent<HTMLSelectElement>): void => {
        this.setState({sport: evt.target.value});
    }

    // Sets event as the inputted event name
    doEventChangeClick = (evt: ChangeEvent<HTMLSelectElement>): void => {
        this.setState({event: evt.target.value});
    }

    // Sets name as the inputted name
    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({name: evt.target.value});
    }

    // Sets tickets as the inputted (valid) tickets (non-negative, within tickets left)
    doTicketsChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        const inputTickets = evt.target.value;
        const numTickets = BigInt(inputTickets);
        if (this.state.details !== null) {
            if (numTickets > 0 && numTickets <= this.state.details.ticketsLeft) {
                this.setState({ tickets: inputTickets });
            } else {
                alert('Please enter a valid number of tickets.');
            }
        }
    }

    // Called when the user presses the Back button to back-click to EventDisplay page
    doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBack();
        this.setState({sport: '', event: '', name: '', tickets: ''});
    }

    // Called when the user presses the Get Tickets button to successfully get tickets for the event
    doGetClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.sport !== '' && this.state.event !== '' && this.state.name !== '' && this.state.tickets !== '') {
            const name = this.state.event + " (" + this.state.sport + ")";
            if (this.state.details !== null) {
                const update: EventDetails = {sport: this.state.details.sport, event: this.state.details.event,
                    ticketsLeft: this.state.details.ticketsLeft - BigInt(this.state.tickets),
                    ticketsSold: this.state.details.ticketsSold + BigInt(this.state.tickets),
                    date: this.state.details.date, description: this.state.details.description, venue: this.state.details.venue};
                this.props.onGet(name, update);
            }
            this.setState({sport: '', event: '', name: '', tickets: '', details: null});
        }
    }

    // Sets details as the retrieved details from the server
    doGetClickResp = (name: string, details: EventDetails | null): void => {
        if (details !== null) {
            this.setState({details: details});
            console.log('found details under event ' + name);
        } else {
            console.log('cannot find details under ' + name);
        }
    }

    // Accesses the /fetch server, and retrieves the sporting event data associated with the sporting event name
    // Passes in sporting event data when completed
    doFetchEventDetailsClick = (name: string, cb: FetchCallback): void => {
        fetch("/api/fetch?name=" + encodeURIComponent(name))
            .then((res) => this.doFetchEventDetailsResp(name, res, cb))
            .catch(() => this.doFetchEventDetailsError("failed to connect to server"));
    }

    // Called when the server responds to a request to retrieve data associated with the sporting event name
    doFetchEventDetailsResp = (name: string, res: Response, cb: FetchCallback): void => {
        if (res.status === 200) {
            res.json().then((val) => this.doFetchEventDetailsJson(name, val, cb))
                .catch(() => this.doFetchEventDetailsError("200 response is not JSON"));
        } else if (res.status === 400) {
            res.text().then(this.doFetchEventDetailsError)
                .catch(() => this.doFetchEventDetailsError("400 response is not text"));
        } else {
            this.doFetchEventDetailsError(`bad status code: ${res.status}`);
        }
    }

    // Called when the fetch response JSON has been parsed
    doFetchEventDetailsJson = (name: string, val: unknown, cb: FetchCallback): void => {
        if (!isRecord(val) || typeof val.name !== 'string' || val.content === undefined) {
            console.error('Invalid JSON from /api/fetch', val);
            return;
        }
        if (val.content === null) {
            cb(name, null);
        } else {
            cb(name, fromJson(val.content));
        }
    }

    // Called when there is an error in fetching such data
    doFetchEventDetailsError = (msg: string): void => {
        console.error(`Error fetching /api/fetch ${msg}`);
    }
}