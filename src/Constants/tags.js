export const getTags = (url) => {
    const tags = [];

    return fetch(url + 'tags')
        .then(res => res.json())
        .then(res => {

            var allIds = '';
            res.forEach(d => {

                // If not valid city name, skip it
                if ( d._id === null ||  d.type === 'deal')
                    return;
                allIds = allIds + d._id + ',';
                tags.push({
                    name: d.name,
                    id: d._id,
                    image: d.image_url
                })
            });
            //Remove last ,
            allIds = allIds.substring(0, allIds.length - 1);
            console.log(allIds);
            tags.unshift({
                name: 'Anywhere',
                id: allIds,
                image: require('../images/cards/anywhere.png')
            });
            return tags;
        })

};
