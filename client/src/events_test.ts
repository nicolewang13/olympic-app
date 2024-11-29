import * as assert from 'assert';
import { EventDetails, Event, toJson, fromJson, topThree, getSports, getEvents } from './events';

describe('events', function() {
    it('toJson', function() {
        // Straight-line code
        const details1: EventDetails = {sport: 'diving', event: 'finals', ticketsLeft: 100n, ticketsSold: 300n,
            date: 13n, description: 'diving finals', venue: 'Husky Stadium'};
        assert.deepStrictEqual(toJson(details1), ['diving', 'finals', '100', '300', '13', 'diving finals', 'Husky Stadium']);

        //Straight-line code
        const details2: EventDetails = {sport: 'gymnastics', event: 'semifinals', ticketsLeft: 0n, ticketsSold: 200n,
            date: 6n, description: 'gymnastics semifinals', venue: 'T-Mobile Park'};
        assert.deepStrictEqual(toJson(details2), ['gymnastics', 'semifinals', '0', '200', '6', 'gymnastics semifinals', 'T-Mobile Park']);
    });

    it('fromJson', function() {
        
        // If branch: input is an array

        // - If branch: input array is of length 7 (straight-line code)
        const json1 = ['diving', 'finals', '100', '300', '13', 'diving finals', 'Husky Stadium'];
        assert.deepStrictEqual(fromJson(json1), {sport: 'diving', event: 'finals', ticketsLeft: 100n, ticketsSold: 300n,
            date: 13n, description: 'diving finals', venue: 'Husky Stadium'});

        // - If branch: input array is of length 7 (straight-line code)
        const json2 = ['gymnastics', 'semifinals', '0', '200', '6', 'gymnastics semifinals', 'T-Mobile Park'];
        assert.deepStrictEqual(fromJson(json2), {sport: 'gymnastics', event: 'semifinals', ticketsLeft: 0n, ticketsSold: 200n,
            date: 6n, description: 'gymnastics semifinals', venue: 'T-Mobile Park'});

        // - Else branch: input array is not of length 7 - Error
        assert.throws(() => fromJson([]), Error);

        // - Else branch: input array is not of length 7 - Error
        assert.throws(() => fromJson(['a', 'b', 'c']), Error);
        
        // Else branch: input is not an array - Error
        assert.throws(() => fromJson(1n), Error);

        // Else branch: input is not an array - Error
        assert.throws(() => fromJson('nicole'), Error);
    });

    it('topThree', function() {
        // Straight-line code
        const event1: Event = {eventName: 'event1', details: {sport: 'diving', event: 'finals', ticketsLeft: 100n, ticketsSold: 300n,
            date: 13n, description: 'diving finals', venue: 'Husky Stadium'}};
        const event2: Event = {eventName: 'event2', details: {sport: 'gymnastics', event: 'semifinals', ticketsLeft: 0n, ticketsSold: 200n,
            date: 6n, description: 'gymnastics semifinals', venue: 'T-Mobile Park'}};
        const event3: Event = {eventName: 'event3', details: {sport: 'soccer', event: 'quarterfinals', ticketsLeft: 50n, ticketsSold: 400n,
            date: 3n, description: 'soccer quarterfinals', venue: 'Madison Square Park'}};
        const events1: Event[] = [event1, event2, event3];
        assert.deepStrictEqual(topThree(events1), [event3, event1, event2]);

        // Straight-line code
        const event4: Event = {eventName: 'event4', details: {sport: 'diving', event: 'finals', ticketsLeft: 100n, ticketsSold: 0n,
            date: 13n, description: 'diving finals', venue: 'Husky Stadium'}};
        const event5: Event = {eventName: 'event5', details: {sport: 'gymnastics', event: 'semifinals', ticketsLeft: 0n, ticketsSold: 10n,
            date: 6n, description: 'gymnastics semifinals', venue: 'T-Mobile Park'}};
        const event6: Event = {eventName: 'event6', details: {sport: 'soccer', event: 'quarterfinals', ticketsLeft: 50n, ticketsSold: 20n,
            date: 3n, description: 'soccer quarterfinals', venue: 'Madison Square Park'}};
        const events2: Event[] = [event4, event5, event6];
        assert.deepStrictEqual(topThree(events2), [event6, event5, event4]);
    });

    it('getSports', function() {
        // 0-1-many heuristic: 0 loops - only one possible (empty array)
        assert.deepStrictEqual(getSports([]), []);

        // 0-1-many heuristic: 1 loop
        assert.deepStrictEqual(getSports(['event (sport)']), ['sport']);

        // 0-1-many heuristic: 1 loop
        assert.deepStrictEqual(getSports(['another event (another sport)']), ['another sport']);

        // 0-1-many heuristic: multiple loops
        assert.deepStrictEqual(getSports(['event (sport1)', 'event (sport2)']), ['sport1', 'sport2']);

        // 0-1-many heuristic: multiple loops
        assert.deepStrictEqual(getSports(['event1 (sport1)', 'event2 (sport1)']), ['sport1']);
    });

    it('getEvents', function() {
        // 0-1-many heuristic: 0 loops
        assert.deepStrictEqual(getEvents('sport1', []), []);

        // 0-1-many heuristic: 0 loops
        assert.deepStrictEqual(getEvents('sport2', []), []);

        // 0-1-many heuristic: 1 loop - sport matches sport in sporting event name
        assert.deepStrictEqual(getEvents('sport1', ['event (sport1)']), ['event']);

        // 0-1-many heuristic: 1 loop - sport matches sport in sporting event name
        assert.deepStrictEqual(getEvents('sport2', ['event (sport2)']), ['event']);

        // 0-1-many heuristic: 1 loop - sport does not match sport in sporting event name
        assert.deepStrictEqual(getEvents('sport1', ['event (not a match)']), []);

        // 0-1-many heuristic: 1 loop - sport does not match sport in sporting event name
        assert.deepStrictEqual(getEvents('sport1', ['event (you really thought it would be a match)']), []);

        // 0-1-many heuristic: multiple loops
        assert.deepStrictEqual(getEvents('sport1', ['event1 (sport1)', 'event2 (sport1)']), ['event1', 'event2']);

        // 0-1-many heuristic: multiple loops
        assert.deepStrictEqual(getEvents('sport1', ['event (sport1)', 'event (sport2)']), ['event']);
    });
});