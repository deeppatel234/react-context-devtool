const uniqId = prefix => {
    let counter = 0;

    return () => {
        counter += 1;
        return `${prefix}_${counter}`;
    };
};

export const getUniqId = uniqId('debugId');
