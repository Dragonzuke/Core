# Core Discord Bot v1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Key:
[x] => Completed
[-] => Partially Completed
[!] => Important to work on
[B] => Bug Report
[] => Testing needs to be completed.
[]  => Not Completed
[NAME] => Inserted name is working on it
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- [x] Database Support
    - [x] Server Settings
        - [x] Log Channels
            - [x] Mod Log
            - [x] Message Log
            - [x] Invite Log
            - [x] Join & Leave Log
        - [x] Ticket Category
        - [x] Moderator Roles
        - [x] Admin Roles
        - [x] Mute Role
    - [x] Modules
        - [x] Security
        - [x] Moderation
        - [x] Auto-Mod
        - [x] Audit Log
        - [x] Tickets
    - [x] Punishments
        - [x] Guild
        - [x] User
        - [x] Type
        - [x] Active
        - [x] Expiration
        - [x] Reason

- [] Different Modules
    - [] Security Module
        - [] Alt Checker
        - [] Anti Raid
            - [] If people join rapidly on 1 invite, delete it.
        - [] Captcha Check
    - [x] Moderation Module
        - [x] Warn Command
        - [x] Mute Command
        - [x] Kick Command
        - [x] Ban Command
        - [x] Cases Command
            - [x] User Lookup
            - [x] Detailed Case View
        - [x] Lock Command
        - [x] Slowmode Command
        - [x] Purge Command
    - [] Auto Moderator Module -> Week after next
        - [x] Chat Filter
        - [] Username Filter // Figure out better way to do this
        - [x] Ping Filter
        - [x] Spam Filter
        - [] Invite / Link Filter // Figure out better way to do this
    - [] Audit Logs Module -> Next Week
        - [] Mod Logs
        - [] Message Logs
        - [] Invite Logs
        - [] Join & Leave Logs
    - [] Tickets Module -> This Weekend
        - [] Open Ticket Button
        - [] Close Ticket Button
        - [] Claim Ticket Button
        - [] Transscripts

- [] Moderator System
    Make a system where server admins are able
    to add roles to a list, and those roles
    will have moderation powers throughout the
    bot.
- [] Admin System
    Same with Moderator system, but give access
    to more commands and permissions.