<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

Navigation architecture: NAV_LINKS in src/lib/queries.ts is the single source for the header menu (Home | Campus | Spotlights | Creative | Interactive | Events), with Archive on its own dateline bar and /news and /game kept as redirect stubs — so the menu is edited in one place and old links never die.

Game architecture: each poetry game is its own component in src/components/game/ mounted by the shared /interactive hub, with all puzzle content in src/lib/games.ts (public-domain lines only) so every game stays independently maintainable.

Literary Corner data: Book of the Month and the Literary Note are rows in the corner table (kind 'book' | 'note') shown inside Creative and edited from the desk's Literary Corner tab, never hardcoded — so the owner can swap them each month. Student work lands in the submissions table and only reaches the public site once the owner approves it or publishes it into Spotlights.
