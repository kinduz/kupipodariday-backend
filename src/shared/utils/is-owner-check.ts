export function isOwnerInEntityCheck(userId: string, ownerId: string) {
  return userId === ownerId;
}
