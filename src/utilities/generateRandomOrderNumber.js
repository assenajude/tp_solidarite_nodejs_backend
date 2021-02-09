const randomOrderNumber = (currentNumbers) => {
        min = 1000000000,
        max = 9999999999,
        rnd;

        rnd = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!track[rnd]) {
            arr[ii] = track[rnd] = rnd;
        }

}