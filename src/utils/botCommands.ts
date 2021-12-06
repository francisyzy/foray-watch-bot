import { BotCommand } from "typegram";
/**
 * All admin commands here
 * @return {BotCommand[]} List of admin commands
 */
export function getBotCommands(): BotCommand[] {
  const BotCommand: BotCommand[] = [
    {
      command: "intervals",
      description: "Check 🛡 foray intervals",
    },
    {
      command: "stats",
      description: "Get foray stats",
    },
  ];
  return BotCommand;
}
