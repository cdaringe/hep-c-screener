var ava = require('ava').default
var hcvWorkflows = require('../../src/hcv-workflows')

ava.before(t => {
	t.context.babyBoomerPatient = {
		birthDate: "1951-03-09"
	}

	t.context.noBirthDatePatient = {}
	
	t.context.emptyBirthDatePatient = {
		birthDate: ""
	}

	t.context.nanBirthYearPatient = {
		birthDate: "aaaa-09-01"
	}

	t.context.millennialPatient = {
		birthDate: "1995-03-09"
	}
});

ava("Verify Patient is a babyboomer", t => {
	t.truthy(hcvWorkflows.patient.isBabyBoomer(t.context.babyBoomerPatient))
});

ava("Verify Patient with empty birth date is not a babyboomer", t => {
	t.falsy(hcvWorkflows.patient.isBabyBoomer(t.context.emptyBirthDatePatient))
});

ava("Verify Patient with no birth date is not a babyboomer", t => {
	t.falsy(hcvWorkflows.patient.isBabyBoomer(t.context.noBirthDatePatient))
});

ava("Verify Patient with nan birth year is not a babyboomer", t => {
	t.falsy(hcvWorkflows.patient.isBabyBoomer(t.context.nanBirthYearPatient))
});

ava("Verify Patient with no birthdate is not a babyboomer", t => {
	t.falsy(hcvWorkflows.patient.isBabyBoomer(t.context.nanBirthYearPatient))
});

ava("Verify millenial Patient with no birthdate is not a babyboomer", t => {
	t.falsy(hcvWorkflows.patient.isBabyBoomer(t.context.millennialPatient))
});