# KUI-2088 Avveckla social-api

End goal: to link to a public timetable for the selected courseround

- getSocialDD2257.json contains response from social-api for course DD2257
- take call to X-API out of Promise.all so that we can continue rendering if the page. Alternatively find another way of handling the timeout and continuing the code without schemalänk
