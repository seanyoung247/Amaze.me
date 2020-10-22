# Testing

[README.md](README.md)

### Automated Testing

#### Validation

HTML and CSS code were validated with the W3C Markup and CSS validators. Both were found to have no errors or warnings. Reports can be seen below:

[W3C HTML validation report](https://seanyoung247.github.io/Second-milestone-project/spec/index-validation.html)

[W3C CSS validation report](https://seanyoung247.github.io/Second-milestone-project/spec/stylesheet-validation.html)

Google Chromes lighthouse was also run and provided the following report:

[Lighthouse report](https://seanyoung247.github.io/Second-milestone-project/spec/lighthouse-report.html)

#### Jasmine Unit Tests

Jasmine was used to ensure correct output to specifications for a number of the sites basic JavaScript types and objects. Some objects were not tested in this way due to being either more abstract or indirect in output (like the Camera) or being based around user interaction, like the Player.

Code tested through Jasmine:

- Point2
- Vector2
- BoundingBox
- Ray2
- RayMap2
- GameObject

The automated Jasmine tests can be run from [tests.html](tests.html)

### Manual Testing

#### Testing Environments

Primary iterative testing was undertaken on a SurfaceBook2 Laptop running Windows 10 in the Google Chrome web browser. Once a feature was considered complete it was tested in other environments. Unfortunately, as I'm currently working overseas, my access to test systems is limited. Because of this, no primary testing on Apple products could be undertaken.

**Desktop testing:**

- Platforms:
  - Microsoft SurfaceBook2 (Windows 10)
  - Dell Optiplex workstation (Windows 7)
  - Fujitsu Lifebook (Windows 8)
- Browsers:
  - Chrome
  - Firefox
  - Edge
  - Opera

**Mobile testing:**

- Platforms
  - AT&T Radiant Core (Android 9)
  - Samsung Galaxy J6 (Android 9)
  - OnePlus7 (Android 10)
  - Lenovo MTab10 (Android 9)
- Browsers
  - Chrome
  - Edge
  - Opera

#### Testing methodology

Code changes were tested prior to committing and pushing to github on the local machine. This was in an attempt to prevent faulty or broken code from being pushed to the repository or deployed to the live site. On occasions where bugs were missed in testing an issue was opened on github if appropriate. Further, issues were not raised for known feature incomplete code committed to github, as this information was captured in the coding to-do lists. This approach kept most bugs from being uploaded, with only a few cases of bugs either too complex to be fixed for the current release, or those that introduced regressions in existing code being uploaded.

#### Unit Testing

Manual unit testing was conducted iteratively by attempting to "break" new code. For instance, making the player run into walls after collision detection was added. In this way most bugs were caught and fixed before committing to the repository and live site.

The JavaScript console was used to output variable values during play to give hints to where faults were occurring and why. In some cases game data was also printed to the screen to make it easier to catch faults. 

#### Peer code Review

The project was submitted to peer review on the code institute slack [channel](https://code-institute-room.slack.com/archives/CGWQJQKC5/p1603152019296500).

#### User Acceptance Testing



### Known Issues

#### Wall collision

[**Player can overlap walls**](https://github.com/seanyoung247/Second-milestone-project/issues/2)

**Reason for introduction to repository:**

- Bug is minor and unlikely to be seen at runtime and fix is too complex for current deadline. Raised as issue for future fix.

**Cause and proposed fix:**

- Under some specific conditions the player can overlap or even pass through walls.
  - Collision detection is performed on x and y coordinates separately so collision in one dimension doesn't prevent moving in another. This means that under certain conditions moving in one dimension can bring the player into collision in another dimension without it being detected.
    - Requires improvements to the collision detection algorithm. After movement the player should be checked for collision again in all dimensions. If collision is detected in a dimension, the player object should be moved back along that dimensions view vector until no collision is detected.

**[Game text doesn't fit on screen in portrait mode](https://github.com/seanyoung247/Second-milestone-project/issues/3)**

**Reason for introduction to repository:**

- Bug is minor and best method for fix is unclear. Raised as issue for future fix.

**Cause and proposed fix:**

- On very thin screens overlay text is wider than the available screen space.
  - Screen width could be read to scale text and/or break up long lines in portrait mode.
  - It may be best to attempt to restrict the screen to landscape mode on phone screens.