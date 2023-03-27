class register {
    constructor(name) {
        this.data = 0;
        this.name = name;
    }

    // setValue(value) {
    //     let index = this.data.length - 1;

    //     while (value > 0 && index >= 0) {
    //         this.data[index] = value % 2;
    //         value = Math.floor(value / 2);
    //         index--;
    //     }

    //     while (index >= 0) {
    //         this.data[index] = 0;
    //         index--;
    //     }
    // }

    setValue(value) {
        this.data = bigInt(value);
    }
}
