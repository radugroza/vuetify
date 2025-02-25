import Vue from 'vue';
import { validateTimestamp, parseTimestamp, parseDate, } from '../util/timestamp';
export default Vue.extend({
    name: 'times',
    props: {
        now: {
            type: String,
            validator: validateTimestamp,
        },
    },
    data: () => ({
        times: {
            now: parseTimestamp('0000-00-00 00:00', true),
            today: parseTimestamp('0000-00-00', true),
        },
    }),
    computed: {
        parsedNow() {
            return this.now ? parseTimestamp(this.now, true) : null;
        },
    },
    watch: {
        parsedNow: 'updateTimes',
    },
    created() {
        this.updateTimes();
        this.setPresent();
    },
    methods: {
        setPresent() {
            this.times.now.present = this.times.today.present = true;
            this.times.now.past = this.times.today.past = false;
            this.times.now.future = this.times.today.future = false;
        },
        updateTimes() {
            const now = this.parsedNow || this.getNow();
            this.updateDay(now, this.times.now);
            this.updateTime(now, this.times.now);
            this.updateDay(now, this.times.today);
        },
        getNow() {
            return parseDate(new Date());
        },
        updateDay(now, target) {
            if (now.date !== target.date) {
                target.year = now.year;
                target.month = now.month;
                target.day = now.day;
                target.weekday = now.weekday;
                target.date = now.date;
            }
        },
        updateTime(now, target) {
            if (now.time !== target.time) {
                target.hour = now.hour;
                target.minute = now.minute;
                target.time = now.time;
            }
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcG9uZW50cy9WQ2FsZW5kYXIvbWl4aW5zL3RpbWVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQTtBQUVyQixPQUFPLEVBQ0wsaUJBQWlCLEVBQ2pCLGNBQWMsRUFDZCxTQUFTLEdBQ1YsTUFBTSxtQkFBbUIsQ0FBQTtBQUcxQixlQUFlLEdBQUcsQ0FBQyxNQUFNLENBQUM7SUFDeEIsSUFBSSxFQUFFLE9BQU87SUFFYixLQUFLLEVBQUU7UUFDTCxHQUFHLEVBQUU7WUFDSCxJQUFJLEVBQUUsTUFBTTtZQUNaLFNBQVMsRUFBRSxpQkFBaUI7U0FDN0I7S0FDRjtJQUVELElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ1gsS0FBSyxFQUFFO1lBQ0wsR0FBRyxFQUFFLGNBQWMsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUM7WUFDN0MsS0FBSyxFQUFFLGNBQWMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDO1NBQzFDO0tBQ0YsQ0FBQztJQUVGLFFBQVEsRUFBRTtRQUNSLFNBQVM7WUFDUCxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7UUFDekQsQ0FBQztLQUNGO0lBRUQsS0FBSyxFQUFFO1FBQ0wsU0FBUyxFQUFFLGFBQWE7S0FDekI7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFBO1FBQ2xCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtJQUNuQixDQUFDO0lBRUQsT0FBTyxFQUFFO1FBQ1AsVUFBVTtZQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFBO1lBQ3hELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFBO1lBQ25ELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO1FBQ3pELENBQUM7UUFDRCxXQUFXO1lBQ1QsTUFBTSxHQUFHLEdBQXNCLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO1lBQzlELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7WUFDbkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUNwQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3ZDLENBQUM7UUFDRCxNQUFNO1lBQ0osT0FBTyxTQUFTLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFBO1FBQzlCLENBQUM7UUFDRCxTQUFTLENBQUUsR0FBc0IsRUFBRSxNQUF5QjtZQUMxRCxJQUFJLEdBQUcsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLElBQUksRUFBRTtnQkFDNUIsTUFBTSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFBO2dCQUN0QixNQUFNLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUE7Z0JBQ3hCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQTtnQkFDcEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFBO2dCQUM1QixNQUFNLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUE7YUFDdkI7UUFDSCxDQUFDO1FBQ0QsVUFBVSxDQUFFLEdBQXNCLEVBQUUsTUFBeUI7WUFDM0QsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxJQUFJLEVBQUU7Z0JBQzVCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQTtnQkFDdEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFBO2dCQUMxQixNQUFNLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUE7YUFDdkI7UUFDSCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVnVlIGZyb20gJ3Z1ZSdcblxuaW1wb3J0IHtcbiAgdmFsaWRhdGVUaW1lc3RhbXAsXG4gIHBhcnNlVGltZXN0YW1wLFxuICBwYXJzZURhdGUsXG59IGZyb20gJy4uL3V0aWwvdGltZXN0YW1wJ1xuaW1wb3J0IHsgQ2FsZW5kYXJUaW1lc3RhbXAgfSBmcm9tICd2dWV0aWZ5L3R5cGVzJ1xuXG5leHBvcnQgZGVmYXVsdCBWdWUuZXh0ZW5kKHtcbiAgbmFtZTogJ3RpbWVzJyxcblxuICBwcm9wczoge1xuICAgIG5vdzoge1xuICAgICAgdHlwZTogU3RyaW5nLFxuICAgICAgdmFsaWRhdG9yOiB2YWxpZGF0ZVRpbWVzdGFtcCxcbiAgICB9LFxuICB9LFxuXG4gIGRhdGE6ICgpID0+ICh7XG4gICAgdGltZXM6IHtcbiAgICAgIG5vdzogcGFyc2VUaW1lc3RhbXAoJzAwMDAtMDAtMDAgMDA6MDAnLCB0cnVlKSxcbiAgICAgIHRvZGF5OiBwYXJzZVRpbWVzdGFtcCgnMDAwMC0wMC0wMCcsIHRydWUpLFxuICAgIH0sXG4gIH0pLFxuXG4gIGNvbXB1dGVkOiB7XG4gICAgcGFyc2VkTm93ICgpOiBDYWxlbmRhclRpbWVzdGFtcCB8IG51bGwge1xuICAgICAgcmV0dXJuIHRoaXMubm93ID8gcGFyc2VUaW1lc3RhbXAodGhpcy5ub3csIHRydWUpIDogbnVsbFxuICAgIH0sXG4gIH0sXG5cbiAgd2F0Y2g6IHtcbiAgICBwYXJzZWROb3c6ICd1cGRhdGVUaW1lcycsXG4gIH0sXG5cbiAgY3JlYXRlZCAoKSB7XG4gICAgdGhpcy51cGRhdGVUaW1lcygpXG4gICAgdGhpcy5zZXRQcmVzZW50KClcbiAgfSxcblxuICBtZXRob2RzOiB7XG4gICAgc2V0UHJlc2VudCAoKTogdm9pZCB7XG4gICAgICB0aGlzLnRpbWVzLm5vdy5wcmVzZW50ID0gdGhpcy50aW1lcy50b2RheS5wcmVzZW50ID0gdHJ1ZVxuICAgICAgdGhpcy50aW1lcy5ub3cucGFzdCA9IHRoaXMudGltZXMudG9kYXkucGFzdCA9IGZhbHNlXG4gICAgICB0aGlzLnRpbWVzLm5vdy5mdXR1cmUgPSB0aGlzLnRpbWVzLnRvZGF5LmZ1dHVyZSA9IGZhbHNlXG4gICAgfSxcbiAgICB1cGRhdGVUaW1lcyAoKTogdm9pZCB7XG4gICAgICBjb25zdCBub3c6IENhbGVuZGFyVGltZXN0YW1wID0gdGhpcy5wYXJzZWROb3cgfHwgdGhpcy5nZXROb3coKVxuICAgICAgdGhpcy51cGRhdGVEYXkobm93LCB0aGlzLnRpbWVzLm5vdylcbiAgICAgIHRoaXMudXBkYXRlVGltZShub3csIHRoaXMudGltZXMubm93KVxuICAgICAgdGhpcy51cGRhdGVEYXkobm93LCB0aGlzLnRpbWVzLnRvZGF5KVxuICAgIH0sXG4gICAgZ2V0Tm93ICgpOiBDYWxlbmRhclRpbWVzdGFtcCB7XG4gICAgICByZXR1cm4gcGFyc2VEYXRlKG5ldyBEYXRlKCkpXG4gICAgfSxcbiAgICB1cGRhdGVEYXkgKG5vdzogQ2FsZW5kYXJUaW1lc3RhbXAsIHRhcmdldDogQ2FsZW5kYXJUaW1lc3RhbXApOiB2b2lkIHtcbiAgICAgIGlmIChub3cuZGF0ZSAhPT0gdGFyZ2V0LmRhdGUpIHtcbiAgICAgICAgdGFyZ2V0LnllYXIgPSBub3cueWVhclxuICAgICAgICB0YXJnZXQubW9udGggPSBub3cubW9udGhcbiAgICAgICAgdGFyZ2V0LmRheSA9IG5vdy5kYXlcbiAgICAgICAgdGFyZ2V0LndlZWtkYXkgPSBub3cud2Vla2RheVxuICAgICAgICB0YXJnZXQuZGF0ZSA9IG5vdy5kYXRlXG4gICAgICB9XG4gICAgfSxcbiAgICB1cGRhdGVUaW1lIChub3c6IENhbGVuZGFyVGltZXN0YW1wLCB0YXJnZXQ6IENhbGVuZGFyVGltZXN0YW1wKTogdm9pZCB7XG4gICAgICBpZiAobm93LnRpbWUgIT09IHRhcmdldC50aW1lKSB7XG4gICAgICAgIHRhcmdldC5ob3VyID0gbm93LmhvdXJcbiAgICAgICAgdGFyZ2V0Lm1pbnV0ZSA9IG5vdy5taW51dGVcbiAgICAgICAgdGFyZ2V0LnRpbWUgPSBub3cudGltZVxuICAgICAgfVxuICAgIH0sXG4gIH0sXG59KVxuIl19