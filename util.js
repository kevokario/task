const getUserLocation = (userIP) => {
    return new Promise((resolve, reject) => {
        request({
            url:
                `${APIs.IpGeoLocation.url}?apiKey=${APIs.IpGeoLocation.APIKey}
    &ip=${userIP}`,
            rejectUnauthorized: false
        }, (error, response, body) => {
            if (!error && response.statusCode == 200)
                resolve(body);
            else
                return reject(body);
        }
        );
    });
};

exports.getUserCity = async () => {
    const userIP = await publicIP.v4();
    const userLocation = await getUserLocation(userIP);
    return JSON.parse(userLocation).city;
}

exports.getTicketMasterEvents = (userCity, page, size, keyword)
    => {
    return new Promise((resolve, reject) => {
        request({
            url: keyword === undefined ? `${APIs.TicketMaster.url}?apikey=${APIs.TicketMaster.APIKey}&city=${userCity}&size=${size}&page=${page}` : `${APIs.TicketMaster.url}?apikey=${APIs.TicketMaster.APIKey}&city=${userCity}&size=${size}&page=${page}&keyword=${keyword}`,
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) resolve(body);
            else
                return reject(body);
        }
        );
    });
};

exports.getSimplifiedEventList = (events) => {
    return events.map(event => {
        return {
            name: event.name,
            url: event.url,
            type: event.type,
            date: event.dates.start.localDate,
            time: event.dates.start.localTime,
            classification: event.classifications.genre,
            venue: event._embedded.venues[0].name,
            address:
                `${event._embedded.venues[0].address.line1},
                ${event._embedded.venues[0].city.name}
                ,${event._embedded.venues[0].state.stateCode},
                ${event._embedded.venues[0].postalCode},
                ${event._embedded.venues[0].country.name}.`,
            latitude: event._embedded.venues[0].location.latitude,
            longitude: event._embedded.venues[0].location.longitude,
            description: event.info
        }
    });
};

const getAllEvents = async (keyword) => {
    return new Promise(async (resolve, reject) => {
        const userCity = await util.getUserCity();
        try {
            let ticketMasterData = await
                util.getTicketMasterEvents(userCity, 0, 200, keyword);
            const { _embedded, page } = JSON.parse(ticketMasterData);
            if (_embedded === undefined) {
                resolve({ "result": "No events found." });
            }
            let allEvents =
                [...util.getSimplifiedEventList(_embedded.events)];
            console.log(`Initial page info- Total Pages:
    ${page.totalElements}, Current Page: ${page.number}, Current
    Size: ${page.size}`); for (let i = page.number + 1; i < page.totalPages; i++) {
                let pageSize = i == page.totalPages - 1 ?
                    page.totalElements - page.size : 200;
                ticketMasterData =
                    await util.getTicketMasterEvents(userCity, i, pageSize);
                const { _embedded } = JSON.parse(ticketMasterData);
                allEvents = [...allEvents,
                ...util.getSimplifiedEventList(_embedded.events)];
                console.log(`Fetching events from page ${i} with size
    ${pageSize}`);
            }
            console.log(`Total data length: ${allEvents.length}`);
            resolve(allEvents);
        } catch (error) {
            reject(error);
        }
    });
};