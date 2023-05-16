<script lang="ts">
	let ages = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
	let genders = ['Male', 'Female', 'Other'];
	let races = [
		'White',
		'Black',
		'American Indian or Alaska Native',
		'Asian or Pacific Islander',
		'Two or more races'
	];
	let hispanics = ['Hispanic', 'Not Hispanic'];
	let educations = [
		'Some High School Credit',
		'High School Degree',
		'Some College Credit',
		"Associate's degree",
		"Bachelor's Degree",
		'Graduate Degree'
	];
	let politicals = ['Liberal', 'Moderate', 'Conservative', 'Other'];

	let age_choice = '';
	let gender_choice = '';
	let race_choice = '';
	let hispanic_choice = '';
	let education_choice = '';
	let political_choice = '';
	//, gender_choice, race_choice, hispanic_choice, education_choice, political_choice;

	let feedback = '';
</script>

<h2>Demographic Survey:</h2>

<p>Please fill out the following survey describing your demographic information.</p>

<p>Age:</p>
{#each ages as age}
	<label>
		<input type="radio" name="ages" value={age} bind:group={age_choice} />
		{age}
	</label>
	<br />
{/each}

<p>Gender:</p>
{#each genders as gender}
	<label>
		<input type="radio" name="genders" value={gender} bind:group={gender_choice} />
		{gender}
	</label>
	<br />
{/each}

<p>Race:</p>
{#each races as race}
	<label>
		<input type="radio" name="races" value={race} bind:group={race_choice} />
		{race}
	</label>
	<br />
{/each}

<p>Hispanic:</p>
{#each hispanics as hispanic}
	<label>
		<input type="radio" name="hispanics" value={hispanic} bind:group={hispanic_choice} />
		{hispanic}
	</label>
	<br />
{/each}

<p>Education:</p>
{#each educations as education}
	<label>
		<input type="radio" name="educations" value={education} bind:group={education_choice} />
		{education}
	</label>
	<br />
{/each}

<p>Political View:</p>
{#each politicals as political}
	<label>
		<input type="radio" name="politicals" value={political} bind:group={political_choice} />
		{political}
	</label>
	<br />
{/each}

<p>Do you have any other feedback about this survey?</p>
<textarea bind:value={feedback} rows="5" cols="80" />

<style>
</style>
