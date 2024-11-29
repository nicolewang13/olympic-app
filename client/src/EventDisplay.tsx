import React, { Component, MouseEvent } from "react";
import { Event, topThree } from './events';

type EventDisplayProps = {
    /** The list of all events to display */
    events: Event[];

    /** Called to ask parent to switch to the AddEvent page */
    onAddClick: () => void;

    /** Called to ask parent to switch to the GetTickets page */
    onTicketClick: () => void;

    /** Called to ask parent to refresh the current page with the most up-to-date information */
    onRefreshClick: () => void;
}

/** Displays the UI of the EventDisplay page of the OlympicApp rsvp application */
export class EventDisplay extends Component<EventDisplayProps, {}> {
    constructor(props: EventDisplayProps) {
        super(props);
        this.state = {};
    }

    render = (): JSX.Element => {
        if (this.props.events.length === 0) {
            return <div>
                <h3>Olympic Event List</h3>
                <p>No events yet, better start planning!</p>
                <button type="button" onClick = {this.doAddClick}>Add Event</button>
                <button type="button" onClick = {this.doRefreshClick}>Refresh</button>
            </div>
        } else {
            return <div>
            <h3>Olympic Event List</h3>
            {this.renderEventList()}
            <h3>Ranking:</h3>
            {this.renderPopular()}
            <button type="button" onClick = {this.doAddClick}>Add Event</button>
            <button type="button" onClick = {this.doTicketClick}>Get Tickets</button>
            <button type="button" onClick = {this.doRefreshClick}>Refresh</button>
        </div>
        }
    }

    // Renders all the events to display on the page
    renderEventList = (): JSX.Element => {
        const items: JSX.Element[] = [];
        // Inv: items contains a li for each event of this.props.events[0 .. i-1]
        for (const event of this.props.events) {
            const resultString = event.details.ticketsLeft === 0n ? "SOLD OUT" : event.details.ticketsLeft.toString() + " tickets";
            items.push(<li key={event.eventName}>{event.eventName} | {resultString} | {"August " + event.details.date.toString() + ", 2024"}</li>)
        }
        return <div>{items}</div>;
    }

    // Renders the top 3 events by number of tickets sold
    renderPopular = (): JSX.Element => {
        const three = topThree(this.props.events);
        const gold = three[0] === undefined ? "Gold: N/A" : "Gold: " + three[0].eventName + " - " + three[0].details.ticketsSold.toString() + " sold";
        const silver = three[1] === undefined ? "Silver: N/A" : "Silver: " + three[1].eventName + " - " + three[1].details.ticketsSold.toString() + " sold";
        const bronze = three[2] === undefined ? "Bronze: N/A" : "Bronze: " + three[2].eventName + " - " + three[2].details.ticketsSold.toString() + " sold";
        return <div><p>{gold}</p>
        <p>{silver}</p>
        <p>{bronze}</p></div>
    }

    // Called when the user clicks on the Add Event button to add an event
    doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onAddClick();
    }

    // Called when the user clicks on the Get Tickets button to get tickets for an event
    doTicketClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onTicketClick();
    }

    // Called when the user clicks on the Refresh button to refresh the page
    doRefreshClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
        this.props.onRefreshClick();
    }
}