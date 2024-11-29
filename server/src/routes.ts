import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

// Maps sporting event names to details associated with the sporting event
const nameDetailsMap: Map<string, unknown> = new Map();

/** Updates or adds an event to nameDetailsMap
 *  Returns whether that sporting event name has been previously added
*/
export const updateEvent = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('missing "name" parameter');
    return;
  }
  const value = req.body.content;
  if (value === undefined) {
    res.status(400).send('missing "value" parameter');
    return;
  }
  const exists = nameDetailsMap.has(name);
  nameDetailsMap.set(name, value);
  res.send({saved: exists});
}

/** Returns the data associated with the sporting event name, stored in nameDetailsMap */
export const fetchEventDetails = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.query.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('missing "name" parameter');
  } else if (!nameDetailsMap.has(name)) {
    res.status(404).send('there was no event of this name');
  } else {
    res.send({name: name, content: nameDetailsMap.get(name)});
  }
}

/** Returns the list of keys of the nameDetailsMap (sporting event names),
 *  and the list of values of the nameDetailsMap (sporting event data)
 */
export const retrieveEvents = (_: SafeRequest, res: SafeResponse): void => {
  const keys = Array.from(nameDetailsMap.keys());
  const values = Array.from(nameDetailsMap.values());
  res.send({names: keys, events: values});
}

/** Resets the nameDetailsMap -- used for testing */
export const resetForTesting = (): void => {
  nameDetailsMap.clear();
}
