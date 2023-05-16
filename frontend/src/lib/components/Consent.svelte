<script lang="ts">
	export let consent: boolean;
	let terms = false;
	let age = false;
</script>

<h2>Consent Form</h2>

<p>
	We invite you to participate in a research study being conducted by investigators from Washington
	University in St. Louis. You are being asked to participate in this research study because you are
	a chess player who has an account on Lichess.org. The purpose of this study is to understand how
	personalized AI can be used to give hints to chess players for the purpose of chess education.
</p>

<p>
	If you agree to participate, we would like you to play several chess exercises. In these
	exercises, we will present you with a randomly selected chess position and ask you to make between
	3-10 moves against an AI opponent. We will also present you with an AI assistant who may help you
	play by giving you reccomendations on which moves to play. This experiment will take total of
	approximately 10 minutes.
</p>

<p>
	To ensure that all study particpants are chess players, you will be asked to provide your Lichess
	username and rating through the Lichess API. Using your rating, we will be able to target our AI
	assistant to give reccomendations targeted to your skill level. We will not be able to view your
	password or any private information from your account.
</p>

<p>
	The data you provide through your participation can be used in scientific publications and shared
	with other researchers for scientific, non-commercial purposes. We will not use or share this data
	in any other way. Identifying information will never be used or shared. We will keep the
	information you provide confidential by storing the data in a password-protected place. Your
	Lichess username will be replaced with an arbitrary value after the study is over, and the link
	between your username and the value will be destroyed. However, federal regulatory agencies and
	Washington University, including the Washington University Institutional Review Board (a committee
	that reviews and approves research studies) and the Human Research Protection Office may inspect
	and copy records pertaining to this research. If we write a report about this study we will do so
	in such a way that you cannot be identified.
</p>

<p>
	There are no known risks from being in this study, and you will not benefit personally. However we
	hope that others may benefit in the future from what we learn as a result of this study.
</p>

<p>
	Your participation in this study is completely voluntary. You may choose not to take part at all.
	If you decide to participate in the study, you may stop participating at any time. Any data that
	was collected as part of this study will remain as part of the study records and cannot be
	removed. If you decide not to take part in the study or if you stop participating at any time, you
	won't be penalized or lose any benefits for which you otherwise qualify. If you do not wish to
	participate in this study or you want to end your participation in the study, please simply close
	your browser.
</p>

<p>
	By clicking on the "Continue" button, you indicate you agree to participate in the study and that
	you understand the information in this consent form. You have not waived any legal rights you
	otherwise would have as a participant in a research study.
</p>

<p>
	If you have any questions about the research study itself, please contact Saumik Narayanan at
	<a href="mailto:saumik@wustl.edu">saumik@wustl.edu</a>. If you have questions, concerns, or
	complaints about your rights as a research participant, please contact the Human Research
	Protection Office at 660 South Euclid Avenue, Campus Box 8089, St. Louis, MO 63110,
	1-(800)-438-0445 or email <a href="mailtohrpo@wustl.edu">hrpo@wustl.edu</a>. General information
	about being a research participant can be found on the Human Research Protection Office web site,
	<a href="http://hrpo.wustl.edu">http://hrpo.wustl.edu</a>. To offer input about your experiences
	as a research participant or to speak to someone other than the research staff, call the Human
	Research Protection Office at the number above.
</p>

<label>
	<input type="checkbox" bind:checked={age} />
	I affirm that I am above the age of 18.
</label>
<br />

<label>
	<input type="checkbox" bind:checked={terms} />
	I have read these terms and agree to participate in the experiment.
</label>

<br />
<button disabled={!age || !terms} on:click={() => (consent = true)}> Continue </button>

<style>
</style>
