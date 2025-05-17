
import { HelloWorld } from "./hello-world.class";

describe('HelloWorld class', () => {
    describe('HelloWorld instance', () => {
        it('should instance', () => {
            const instance = new HelloWorld();

            expect(instance).toBeInstanceOf(HelloWorld);
        });
    })
});