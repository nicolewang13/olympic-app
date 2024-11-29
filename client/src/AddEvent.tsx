import React, { Component, ChangeEvent, MouseEvent } from "react";

type AddEventProps = {
    /** Called to ask the parent to create a new event */
    onCreate: (event: string, sport: string, description: string, date: string, venue: string, tickets: string) => void;

    /** Called to ask the parent to back-click (no changes saved) */
    onBack: () => void;
}

type AddEventState = {
    /** The name of the event */
    event: string;

    /** The name of the sport */
    sport: string;

    /** The description of the sporting event */
    description: string;

    /** The day of the sporting event (in August so 1-31) */
    date: string;

    /** The venue of the sporting event */
    venue: string;

    /** The number of tickets to be bought */
    tickets: string;
}

/** Displays the UI of the AddEvent page of the OlympicApp rsvp application */
export class AddEvent extends Component<AddEventProps, AddEventState> {
    constructor(props: AddEventProps) {
        super(props);
        this.state = {event: '', sport: '', description: '', date: '', venue: '', tickets: ''};
    }

    render = (): JSX.Element => {
        return <div>
            <h3>Add Event</h3>
            <p>Event: <input type="text" onChange = {this.doEventChange}></input></p>
            <p>Sport: <input type="text" onChange = {this.doSportChange}></input></p>
            <p>Description: <input type="text" onChange = {this.doDescriptionChange}></input></p>
            <p>Date: August <input type="number" onChange = {this.doDateChange}></input>, 2024</p>
            <p>Venue: <input type="text" onChange = {this.doVenueChange}></input></p>
            <p>Max Tickets Available: <input type="number" onChange = {this.doTicketsChange}></input></p>
            <button onClick = {this.doBackClick}>Back</button>
            <button onClick = {this.doAddClick}>Create</button>
        </div>;
    }

    // Sets the event to the inputted event name
    doEventChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({event: evt.target.value});
    }

    // Sets the sport to the inputted sport name
    doSportChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({sport: evt.target.value});
    }

    // Sets the description to the inputted description of sporting event
    doDescriptionChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({description: evt.target.value});
    }

    // Sets the date to the inputted (valid) date of sporting event
    doDateChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        const date = BigInt(evt.target.value);
        if (date <= 0n || date > 31n) {
            alert('Please input a valid date');
        } else {
            this.setState({date: evt.target.value});
        }
    }

    // Sets the venue to the inputted venue of sporting event
    doVenueChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({venue: evt.target.value});
    }

    // Sets the tickets to the inputted (valid - non-negative) tickets
    doTicketsChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        const tickets = BigInt(evt.target.value);
        if (tickets <= 0n) {
            alert('Please input a valid ticket number');
        } else {
            this.setState({tickets: evt.target.value});
        }
    }

    // Called when the user presses the Create button to add event to the database
    doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        if (this.state.event !== '' && this.state.sport !== '' && this.state.description !== ''
                && this.state.date !== '' && this.state.venue !== '' && this.state.tickets !== '') {
            this.props.onCreate(this.state.event, this.state.sport, this.state.description, this.state.date,
                    this.state.venue, this.state.tickets);
            this.setState({event: '', sport: '', description: '', date: '', venue: '', tickets: ''});
        }
    }

    // Called when the user presses the Back button to back-click to EventDisplay page
    doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBack();
        this.setState({event: '', sport: '', description: '', date: '', venue: '', tickets: ''});
    }
}