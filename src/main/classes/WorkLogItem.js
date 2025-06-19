export class WorkLogItem {
    constructor(authorAccountId, description, issueId, date, time, duration) {
        this.authorAccountId = authorAccountId;
        this.description = description;
        this.issueId = issueId;
        this.startDate = date;
        this.startTime = time;
        this.timeSpentSeconds = duration * 60; // multiply by 60 as duration is captured in minutes and we need it as seconds
    }
}