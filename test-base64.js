const regex = /^data:image\/([a-zA-Z]*);base64,([^\"]*)$/;
const str = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
console.log(str.match(regex));
