import { animate } from "animejs";
import Prism from "prismjs";

import "prismjs/components/prism-java";
import "prismjs/themes/prism-tomorrow.css";
import "../prism-custom.css";

const code = `@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ProfileResponse getProfile() {
        return profileService.getProfile();
    }

}

public record ProfileResponse(
        String name, // William Wadde
        String role, // Full Stack Developer
        String specialization, // Springboot, Angular
        List<String> technologies, // Java, Typescript, AWS
        boolean availableForWork // True
) {}`;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function initCodeEditor() {

    const editor = document.querySelector("#java-code");

    if (!editor) {
        console.warn("#java-code no encontrado");
        return;
    }

    editor.innerHTML = "";

    let current = "";

    for (const char of code) {

        current += char;

        editor.innerHTML = Prism.highlight(
            current,
            Prism.languages.java,
            "java"
        );

        await sleep(8);

    }

    animate(editor, {
        opacity: [0.9, 1],
        duration: 600
    });

}