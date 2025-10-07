import { getTotalTimeSummary } from "../../utils";

export class Business {
	constructor(setToast) {
		this.setToast = setToast;
	}

	async retrieveUsersWeeklyWorkLogs(setTodaysTimeLogged, setThisWeeksTimeLogged) {
		try {
			const result = await window.api.fetchThisWeeksWorklogs();

			const { today, week } = getTotalTimeSummary(result.results);
			setTodaysTimeLogged(today);
			setThisWeeksTimeLogged(week);
		} catch (err) {
			this.setToast({ message: "❌ Could not retrieve this weeks worklogs", type: "error" });
		}
	}

	async retrieveBoardKeys(setBoardKeys) {
		try {
			const results = await window.api.fetchBoardKeys();

			const boards = results.map(board => ({
				id: board.id,
				key: board.key,
				name: board.name
			}));

			setBoardKeys(boards);
		} catch (err) {
			this.setToast({ message: "❌ Could not retrieve board keys", type: "error" });
		}
	}

	async retrieveRecentTickets(setRecentTickets) {
		try {
			const result = await window.api.getRecentTickets();

			setRecentTickets(result);
		} catch (err) {
			this.setToast({ message: "❌ Could not retrieve recent tickets", type: "error" });
		}
	}

	async handleWorklogSubmit(setLoading, data) {
		const { selectedBoardKey, ticket, startTime, duration, description } = data;

		try {
			const formattedTicket = `${selectedBoardKey}-${ticket}`;

			const result = await window.api.submitWorklog({ formattedTicket, startTime, duration, description });

			return result === 200;
		} catch (err) {
			return false;
		}
	};

	async handleSettingsSave(data) {
		const { jiraDomain, jiraEmail, jiraToken, tempoToken, interval, startOnBoot, darkMode } = data;

		try {
			window.api.setInterval(parseInt(interval));
			window.api.setStartup(startOnBoot);
			localStorage.setItem('darkMode', darkMode);

			const { success } = await window.api.saveCredentials({
				jiraDomain,
				jiraEmail,
				jiraToken,
				tempoToken,
			});

			if (!success) {
				this.setToast({ message: "❌ Something went wrong, please check your inputs and try again", type: "error" });
			} else {
				this.setToast({ message: "✅ Settings saved!", type: "success" });
			}
		} catch (err) {
			this.setToast({ message: "❌ Something went wrong, please check your inputs and try again", type: "error" });
		}
	};
}