export type EventDetails = {sport: string, event: string, ticketsLeft: bigint, ticketsSold: bigint,
    date: bigint, description: string, venue: string};

export type Event = {eventName: string, details: EventDetails};

/**
 * Creates a JSON representation of an EventDetails
 * @param details to convert to JSON
 * @returns JSON describing the current EventDetails
 */
export const toJson = (details: EventDetails): unknown => {
    return [details.sport, details.event, details.ticketsLeft.toString(), details.ticketsSold.toString(),
        details.date.toString(), details.description, details.venue];
};

/**
 * Converts a JSON representation to the EventDetails it describes
 * @param data in JSON form to parse into EventDetails
 * @returns EventDetails parsed from given data
 * @throws Error if data is not an array, or if the data array is not of length 7
 */
export const fromJson = (data: unknown): EventDetails => {
    if (Array.isArray(data)) {
      if (data.length === 7) {
        return {sport: data[0], event: data[1], ticketsLeft: BigInt(data[2]), ticketsSold: BigInt(data[3]),
            date: BigInt(data[4]), description: data[5], venue: data[6]};
      } else {
        throw new Error('EventDetails have 7 parts');
      }
    } else {
      throw new Error(`type ${typeof data} is not a valid EventDetails`);
    }
};

/**
 * Returns a new Event array with the top three events by tickets sold
 * @param events an Event array that holds all Events
 * @returns a new Event array with the top three events by tickets sold
 */
export const topThree = (events: Event[]): Event[] => {
    const three = events;
    three.sort((a, b) => Number(b.details.ticketsSold) - Number(a.details.ticketsSold));
    return three.slice(0, 3);
};

/**
 * Returns an array with all sport names in the Olympics
 * @param unordered the names of all sporting event names (formatted as <event name> (<sport name>))
 * @returns a new array with all the sport names (no duplicates)
 */
export const getSports = (unordered: string[]): string[] => {
    const sportsSet = new Set<string>();
    // Inv: sportsSet contains event.substring(event.indexOf('(') + 1, event.indexOf(')')) for each event
    // of unordered[0 .. i-1]
    for (const event of unordered) {
        const sport = event.substring(event.indexOf('(') + 1, event.indexOf(')'));
        sportsSet.add(sport);
    }
    return Array.from(sportsSet);
};

/**
 * Returns an array of all event names for the specified sport in the Olympics
 * @param sport the specified sport name
 * @param unordered the names of all sporting event names (formatted as <event name> (<sport name>))
 * @returns a new array with all the event names for the specified sport (no duplicates)
 */
export const getEvents = (sport: string, unordered: string[]): string[] => {
    const eventsSet = new Set<string>();
    // Inv: sportsSet contains event.substring(0, event.indexOf('(') - 1) for each event
    // of unordered[0 .. i-1] such that sport = event.substring(event.indexOf('(') + 1, event.indexOf(')'))
    for (const event of unordered) {
        const currSport = event.substring(event.indexOf('(') + 1, event.indexOf(')'));
        if (currSport === sport) {
            eventsSet.add(event.substring(0, event.indexOf('(') - 1));
        }
    }
    return Array.from(eventsSet);
};