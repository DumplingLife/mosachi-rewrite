require('dotenv').config();

const synergy = require('./synergy.js');

test('synergy regular API call', (done) => {
    synergy.getGradebook(process.env.TEST_USERNAME, process.env.TEST_PASSWORD, process.env.TEST_URLSUBDOMAIN).then((gradebook) => {
        expect(gradebook.length).toBe(7);
        //quick spot checks
        expect(gradebook[3].name).toBe('AP Phys C -Mech');
        expect(gradebook[5].name).toBe('AP Biology');

        for(let period of gradebook) {
            expect(period.name).toBeDefined();
            for(let assignment of period.assignments) {
                expect(assignment.id).toBeDefined();
                expect(assignment.name).toBeDefined();
                expect(assignment.category).toBeDefined();
                expect(assignment.pointsEarned).toBeDefined();
                expect(assignment.pointsPossible).toBeDefined();
            }
            for(let category of period.categories) {
                expect(category.name).toBeDefined();
                expect(category.weight).toBeDefined();
            }
        }
        done();
    });
});
test('synergy API call with wrong school district', (done) => {
    //console.error is annoying, so mock it away and check that it is called
    console.error = jest.fn();
    synergy.getGradebook('wrongUsername','badPassword','test-bad-school-district').then((gradebook) => {
        expect(gradebook).toBe(synergy.INVALID_CREDENTIALS_STR);
        expect(console.error).toHaveBeenCalled();
        console.error.mockClear();
        done();
    });
});
test('synergy API call with wrong credentials', (done) => {
    synergy.getGradebook('wrongUsername','badPassword','wa-bsd405-psv').then((gradebook) => {
        expect(gradebook).toBe(synergy.INVALID_CREDENTIALS_STR);
        done();
    });
});